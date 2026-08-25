import pool from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  orderConfirmationTemplate,
  reservationConfirmationTemplate,
  sendLoggedEmail,
} from "../services/emailService.js";
import { cleanEmail, cleanText, requireFields } from "../services/sanitize.js";
import { emitRealtime } from "../services/realtime.js";

async function findUserIdByEmail(email) {
  const [rows] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0]?.id || null;
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || !status) {
      return res.status(400).json({ message: "Order ID and status are required." });
    }

    const validStatuses = ['Received', 'In Progress', 'Served', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const result = await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    const order = rows[0];

    emitRealtime("order:updated", order);
    return res.json({ order });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: "Failed to update order status." });
  }
}

export async function createOrder(req, res) {
  try {
    const customerName = cleanText(req.body.customerName, 255);
    const customerEmail = cleanEmail(req.body.customerEmail || req.body.email);
    const orderType = req.body.orderType === "Walk-in" ? "Walk-in" : "Online";
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const specialInstructions = cleanText(req.body.specialInstructions, 1000);

    if (!customerName || !customerEmail || !items.length) {
      return res.status(400).json({ message: "Customer name, email, and order items are required." });
    }

    const subtotal = Number(req.body.subtotal || 0);
    const gst = Number(req.body.gst || 0);
    const total = Number(req.body.total || 0);
    const id = req.body.id || `ORD-${Date.now()}`;
    const userId = await findUserIdByEmail(customerEmail);

    await pool.query(
      "INSERT INTO orders (id, user_id, customer_name, customer_email, order_type, subtotal, gst, total, special_instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, userId, customerName, customerEmail, orderType, subtotal, gst, total, specialInstructions || null]
    );

    const savedItems = [];
    for (const item of items) {
      const itemName = cleanText(item.item?.name || item.itemName, 255);
      const quantity = Number(item.quantity || 1);
      const unitPrice = Number(item.unitPrice || item.item?.price || 0);
      if (!itemName) continue;
      await pool.query(
        "INSERT INTO order_items (order_id, item_id, item_name, quantity, unit_price, customization) VALUES (?, ?, ?, ?, ?, ?)",
        [id, item.item?.id || item.itemId || null, itemName, quantity, unitPrice, JSON.stringify(item.customization || {})]
      );
      savedItems.push({ item_name: itemName, quantity, unit_price: unitPrice });
    }

    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    const order = rows[0];

    await sendLoggedEmail({
      to: customerEmail,
      subject: `Plush Brew order ${id} confirmation`,
      templateName: "order_confirmation",
      relatedType: "order",
      relatedId: id,
      payload: { order, items: savedItems },
      html: orderConfirmationTemplate(order, savedItems),
    });

    emitRealtime("order:new", { order, items: savedItems });
    return res.status(201).json({ order, items: savedItems });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Order could not be saved." });
  }
}

export async function createReservation(req, res) {
  try {
    const missing = requireFields(req.body, ["name", "email", "date", "time"]);
    if (missing) return res.status(400).json({ message: missing });

    const id = req.body.id || `RES-${Date.now()}`;
    const customerEmail = cleanEmail(req.body.email);
    const userId = await findUserIdByEmail(customerEmail);
    const reservation = {
      id,
      user_id: userId,
      customer_name: cleanText(req.body.name, 255),
      customer_email: customerEmail,
      phone: cleanText(req.body.phone, 64),
      reservation_date: req.body.date,
      reservation_time: cleanText(req.body.time, 32),
      guests: Number(req.body.guests || 2),
      seat_type: cleanText(req.body.seatType || "Plush Lounge", 128),
      area_preference: cleanText(req.body.areaPreference || "Indoor", 128),
      special_requests: cleanText(req.body.notes || req.body.specialRequests, 1000),
    };

    await pool.query(
      "INSERT INTO reservations (id, user_id, customer_name, customer_email, phone, reservation_date, reservation_time, guests, seat_type, area_preference, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        reservation.id,
        reservation.user_id,
        reservation.customer_name,
        reservation.customer_email,
        reservation.phone,
        reservation.reservation_date,
        reservation.reservation_time,
        reservation.guests,
        reservation.seat_type,
        reservation.area_preference,
        reservation.special_requests,
      ]
    );

    await sendLoggedEmail({
      to: reservation.customer_email,
      subject: `Plush Brew reservation ${id} confirmation`,
      templateName: "reservation_confirmation",
      relatedType: "reservation",
      relatedId: id,
      payload: reservation,
      html: reservationConfirmationTemplate(reservation),
    });

    emitRealtime("reservation:new", reservation);
    return res.status(201).json({ reservation });
  } catch (error) {
    console.error("Create reservation error:", error);
    return res.status(500).json({ message: "Reservation could not be saved." });
  }
}

export async function listAdminData(req, res) {
  const [ordersRaw] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200");
  const [reservations] = await pool.query("SELECT * FROM reservations ORDER BY created_at DESC LIMIT 200");
  const [customers] = await pool.query("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 200");
  const [cloudMessages] = await pool.query("SELECT * FROM cloud_messages ORDER BY created_at DESC LIMIT 200");
  const [photos] = await pool.query("SELECT * FROM photos ORDER BY created_at DESC LIMIT 200");
  const [vehicles] = await pool.query("SELECT * FROM vehicles ORDER BY created_at DESC LIMIT 200");
  const [reports] = await pool.query("SELECT * FROM reports ORDER BY created_at DESC LIMIT 200");
  const [emailLogs] = await pool.query("SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 200");
  const [scrapbookEntries] = await pool.query(`
    SELECT se.*, s.song_name, s.artist, s.spotify_link, s.youtube_link, s.thumbnail, s.shared_by_name as song_shared_by
    FROM scrapbook_entries se
    LEFT JOIN songs s ON se.song_id = s.id
    ORDER BY se.created_at DESC
    LIMIT 200
  `);
  const [scrapbookItems] = await pool.query("SELECT * FROM scrapbook_items ORDER BY created_at DESC LIMIT 200");
  const [songs] = await pool.query("SELECT * FROM songs ORDER BY created_at DESC LIMIT 200");

  const ordersWithItems = [];
  for (const order of ordersRaw) {
    const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
    ordersWithItems.push({
      ...order,
      items: items.map(item => ({
        id: item.item_id,
        name: item.item_name,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        customization: item.customization ? JSON.parse(item.customization) : {}
      }))
    });
  }

  return res.json({
    orders: ordersWithItems,
    reservations,
    customers,
    cloudMessages,
    photos,
    vehicles,
    reports,
    emailLogs,
    scrapbookEntries,
    scrapbookItems,
    songs,
    stats: {
      totalOrders: ordersWithItems.length,
      totalReservations: reservations.length,
      totalUsers: customers.length,
      totalPhotos: photos.length,
      totalMessages: cloudMessages.length,
      totalVehicles: vehicles.length,
      totalScrapbookEntries: scrapbookEntries.length,
      totalScrapbookItems: scrapbookItems.length,
      totalSongs: songs.length,
    },
  });
}

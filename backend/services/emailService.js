import nodemailer from "nodemailer";
import pool from "../config/db.js";

function createTransporter() {
  if (!process.env.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

export function orderConfirmationTemplate(order, items) {
  const itemRows = items
    .map((item) => `<li>${item.item_name} x ${item.quantity} - Rs.${Number(item.unit_price).toFixed(2)}</li>`)
    .join("");

  return `
    <h2>Your Plush Brew order is confirmed</h2>
    <p>Customer: <strong>${order.customer_name}</strong> (${order.customer_email})</p>
    <p>Order ID: <strong>${order.id}</strong></p>
    <p>Date & Time: ${new Date(order.created_at || Date.now()).toLocaleString("en-IN")}</p>
    <ul>${itemRows}</ul>
    <p>Total Amount: <strong>Rs.${Number(order.total).toFixed(2)}</strong></p>
    <p>Special Instructions: ${order.special_instructions || "None"}</p>
    <p>Estimated Preparation Time: ${order.estimated_prep_time || "20-25 minutes"}</p>
  `;
}

export function reservationConfirmationTemplate(reservation) {
  return `
    <h2>Your Plush Brew table reservation is confirmed</h2>
    <p>Customer: <strong>${reservation.customer_name}</strong> (${reservation.customer_email})</p>
    <p>Reservation ID: <strong>${reservation.id}</strong></p>
    <p>Date: ${reservation.reservation_date}</p>
    <p>Time: ${reservation.reservation_time}</p>
    <p>Guests: ${reservation.guests}</p>
    <p>Seat Type: ${reservation.seat_type || "Plush Lounge"}</p>
    <p>Indoor/Outdoor: ${reservation.area_preference || "Indoor"}</p>
    <p>Special Requests: ${reservation.special_requests || "None"}</p>
  `;
}

export async function sendLoggedEmail({ to, subject, templateName, html, relatedType, relatedId, payload }) {
  const [logResult] = await pool.query(
    "INSERT INTO email_logs (recipient_email, subject, template_name, related_type, related_id, payload, status) VALUES (?, ?, ?, ?, ?, ?, 'queued')",
    [to, subject, templateName, relatedType, relatedId, JSON.stringify(payload || {})]
  );

  const transporter = createTransporter();
  if (!transporter) {
    await pool.query("UPDATE email_logs SET status = 'failed', error_message = ? WHERE id = ?", [
      "SMTP_HOST is not configured. Email logged but not sent.",
      logResult.insertId,
    ]);
    return { sent: false, logId: logResult.insertId };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Plush Brew <no-reply@plushbrew.local>",
      to,
      subject,
      html,
    });
    await pool.query("UPDATE email_logs SET status = 'sent' WHERE id = ?", [logResult.insertId]);
    return { sent: true, logId: logResult.insertId };
  } catch (error) {
    await pool.query("UPDATE email_logs SET status = 'failed', error_message = ? WHERE id = ?", [
      error.message,
      logResult.insertId,
    ]);
    return { sent: false, logId: logResult.insertId };
  }
}

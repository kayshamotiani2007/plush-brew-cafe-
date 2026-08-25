import pool from "../config/db.js";
import { cleanEmail, cleanText } from "../services/sanitize.js";
import { emitRealtime } from "../services/realtime.js";

async function findUserIdByEmail(email) {
  const [rows] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0]?.id || null;
}

function uploadPath(req) {
  return req.file ? `/uploads/${req.file.filename}` : null;
}

export async function listCommunityContent(req, res) {
  const [cloudMessages] = await pool.query("SELECT * FROM cloud_messages WHERE status = 'visible' ORDER BY created_at DESC LIMIT 100");
  const [photos] = await pool.query("SELECT * FROM photos WHERE status = 'approved' ORDER BY created_at DESC LIMIT 100");
  const [vehicles] = await pool.query("SELECT * FROM vehicles WHERE status = 'approved' ORDER BY created_at DESC LIMIT 100");
  const [scrapbookEntries] = await pool.query(`
    SELECT se.*, s.song_name, s.artist, s.spotify_link, s.youtube_link, s.thumbnail
    FROM scrapbook_entries se
    LEFT JOIN songs s ON se.song_id = s.id
    WHERE se.status IN ('visible','featured')
    ORDER BY se.created_at DESC
    LIMIT 100
  `);
  const [songs] = await pool.query("SELECT * FROM songs ORDER BY created_at DESC LIMIT 100");
  res.json({ cloudMessages, photos, vehicles, scrapbookEntries, songs });
}

export async function createCloudMessage(req, res) {
  try {
    const rawAuthorName = req.body.authorName || req.body.name;
    const authorName = cleanText(rawAuthorName, 255) || "Guest";
    const rawAuthorEmail = req.body.authorEmail || req.body.email || req.user?.email;
    const authorEmail = cleanEmail(rawAuthorEmail) || "guest@plushbrew.com";
    const message = cleanText(req.body.message, 1000);
    const messageType = cleanText(req.body.type || "Message", 32);
    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }
    const userId = authorEmail && authorEmail !== "guest@plushbrew.com" ? await findUserIdByEmail(authorEmail) : null;
    const [result] = await pool.query(
      "INSERT INTO cloud_messages (user_id, author_name, author_email, message, message_type) VALUES (?, ?, ?, ?, ?)",
      [userId, authorName, authorEmail, message, messageType]
    );
    const [rows] = await pool.query("SELECT * FROM cloud_messages WHERE id = ?", [result.insertId]);
    emitRealtime("cloud:new", rows[0]);
    res.status(201).json({ cloudMessage: rows[0] });
  } catch (error) {
    console.error('🚨 Cloud message save error:', error.message);
    res.status(500).json({ message: "Failed to save cloud message", error: error.message });
  }
}

export async function createPhoto(req, res) {
  try {
    const uploaderName = cleanText(req.body.uploaderName || req.body.name, 255);
    const uploaderEmail = cleanEmail(req.body.uploaderEmail || req.body.email || req.user?.email);
    const imageUrl = uploadPath(req) || cleanText(req.body.imageUrl, 1000);
    if (!uploaderName || !uploaderEmail || !imageUrl) {
      return res.status(400).json({ message: "Name, email, and image are required." });
    }
    const userId = await findUserIdByEmail(uploaderEmail);
    const [result] = await pool.query(
      "INSERT INTO photos (user_id, uploader_name, uploader_email, caption, image_url) VALUES (?, ?, ?, ?, ?)",
      [userId, uploaderName, uploaderEmail, cleanText(req.body.caption, 1000), imageUrl]
    );
    const [rows] = await pool.query("SELECT * FROM photos WHERE id = ?", [result.insertId]);
    emitRealtime("photo:new", rows[0]);
    res.status(201).json({ photo: rows[0] });
  } catch (error) {
    console.error('🚨 Photo save error:', error.message);
    res.status(500).json({ message: "Failed to save photo", error: error.message });
  }
}

export async function createVehicle(req, res) {
  try {
    const ownerEmail = cleanEmail(req.body.ownerEmail || req.body.email || req.user?.email);
    const vehiclePhoto = uploadPath(req) || cleanText(req.body.vehiclePhoto, 1000);
    const payload = {
      vehicleName: cleanText(req.body.vehicleName, 255),
      vehicleType: cleanText(req.body.vehicleType, 128),
      ownerName: cleanText(req.body.ownerName || req.body.name, 255),
      ownerEmail,
    };
    if (!payload.vehicleName || !payload.vehicleType || !payload.ownerName || !payload.ownerEmail) {
      return res.status(400).json({ message: "Vehicle name, type, owner name, and email are required." });
    }
    const userId = await findUserIdByEmail(ownerEmail);
    const [result] = await pool.query(
      "INSERT INTO vehicles (user_id, vehicle_name, vehicle_type, vehicle_photo, owner_name, owner_email) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, payload.vehicleName, payload.vehicleType, vehiclePhoto, payload.ownerName, payload.ownerEmail]
    );
    const [rows] = await pool.query("SELECT * FROM vehicles WHERE id = ?", [result.insertId]);
    emitRealtime("vehicle:new", rows[0]);
    res.status(201).json({ vehicle: rows[0] });
  } catch (error) {
    console.error('🚨 Vehicle save error:', error.message);
    res.status(500).json({ message: "Failed to save vehicle", error: error.message });
  }
}

export async function createScrapbookEntry(req, res) {
  try {
    const authorEmail = cleanEmail(req.body.authorEmail || req.body.email || req.user?.email);
    const authorName = cleanText(req.body.authorName || req.body.name, 255);
    const songName = cleanText(req.body.songName, 255);
    const songLink = cleanText(req.body.youtubeLink || req.body.spotifyLink, 1000);
    const userId = authorEmail ? await findUserIdByEmail(authorEmail) : null;
    let songId = null;

    if (songName || songLink) {
      const [songResult] = await pool.query(
        "INSERT INTO songs (user_id, song_name, artist, spotify_link, youtube_link, thumbnail, shared_by_name, shared_by_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          songName || "Comfort Song",
          cleanText(req.body.artist, 255),
          cleanText(req.body.spotifyLink, 1000),
          songLink,
          cleanText(req.body.thumbnail, 1000),
          authorName || "Guest",
          authorEmail || "guest@plushbrew.com",
        ]
      );
      songId = songResult.insertId;
      if (userId && songId) {
        await pool.query("INSERT INTO user_song_history (user_id, song_id) VALUES (?, ?)", [userId, songId]);
      }
    }

    const imageUrl = uploadPath(req) || cleanText(req.body.imageUrl, 1000);
    const memory = cleanText(req.body.memory || req.body.caption, 2000);
    if (!authorName && !memory) {
      return res.status(400).json({ message: "Name and memory/caption are required." });
    }

    const [result] = await pool.query(
      "INSERT INTO scrapbook_entries (user_id, author_name, author_email, memory, caption, image_url, song_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, authorName || "Guest", authorEmail || "guest@plushbrew.com", memory, cleanText(req.body.caption, 1000), imageUrl, songId]
    );
    const [rows] = await pool.query("SELECT * FROM scrapbook_entries WHERE id = ?", [result.insertId]);
    emitRealtime("scrapbook:new", rows[0]);
    if (songId) emitRealtime("song:new", { id: songId, song_name: songName, shared_by_name: authorName });
    res.status(201).json({ scrapbookEntry: rows[0] });
  } catch (error) {
    console.error('🚨 Scrapbook save error:', error.message);
    res.status(500).json({ message: "Failed to save scrapbook entry", error: error.message });
  }
}

export async function reportContent(req, res) {
  const targetType = cleanText(req.body.targetType, 64);
  const targetId = Number(req.body.targetId);
  const reason = cleanText(req.body.reason, 1000);
  if (!targetType || !targetId || !reason) {
    return res.status(400).json({ message: "Target and reason are required." });
  }
  const [result] = await pool.query(
    "INSERT INTO reports (reporter_email, target_type, target_id, reason) VALUES (?, ?, ?, ?)",
    [cleanEmail(req.body.reporterEmail || req.user?.email), targetType, targetId, reason]
  );
  if (targetType === "cloud_message") {
    await pool.query("UPDATE cloud_messages SET report_count = report_count + 1 WHERE id = ?", [targetId]);
  }
  emitRealtime("report:new", { id: result.insertId, targetType, targetId, reason });
  res.status(201).json({ reportId: result.insertId });
}

export async function moderateContent(req, res) {
  const tableMap = {
    cloud_message: "cloud_messages",
    photo: "photos",
    vehicle: "vehicles",
    scrapbook_entry: "scrapbook_entries",
  };
  const targetType = cleanText(req.params.targetType, 64);
  const table = tableMap[targetType];
  const id = Number(req.params.id);
  const status = cleanText(req.body.status, 32);
  if (!table || !id || !status) {
    return res.status(400).json({ message: "Valid target and status are required." });
  }
  await pool.query(`UPDATE ${table} SET status = ? WHERE id = ?`, [status, id]);
  await pool.query(
    "INSERT INTO admin_actions (admin_email, action, target_type, target_id, notes) VALUES (?, ?, ?, ?, ?)",
    [req.user.email, `set_status:${status}`, targetType, String(id), cleanText(req.body.notes, 1000)]
  );
  emitRealtime("admin:moderated", { targetType, id, status });
  res.json({ ok: true });
}
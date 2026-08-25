import pool from "../config/db.js";
import { cleanText } from "../services/sanitize.js";

function uploadPath(req) {
  return req.file ? `/uploads/${req.file.filename}` : null;
}

export async function listScrapbookItems(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, description, image_url, created_at FROM scrapbook_items ORDER BY created_at DESC"
    );
    res.json({ scrapbookItems: rows });
  } catch (error) {
    console.error("Failed to fetch scrapbook items:", error);
    res.status(500).json({ message: "Failed to fetch scrapbook items" });
  }
}

export async function createScrapbookItem(req, res) {
  try {
    const title = cleanText(req.body.title, 255);
    const description = cleanText(req.body.description, 2000);
    const imageUrl = uploadPath(req) || cleanText(req.body.imageUrl, 1000);

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required." });
    }

    const [result] = await pool.query(
      "INSERT INTO scrapbook_items (title, description, image_url) VALUES (?, ?, ?)",
      [title, description, imageUrl]
    );

    const [rows] = await pool.query("SELECT * FROM scrapbook_items WHERE id = ?", [result.insertId]);
    res.status(201).json({ scrapbookItem: rows[0] });
  } catch (error) {
    console.error("Failed to create scrapbook item:", error);
    res.status(500).json({ message: "Failed to create scrapbook item", error: error.message });
  }
}

export async function updateScrapbookItem(req, res) {
  try {
    const id = Number(req.params.id);
    const title = cleanText(req.body.title, 255);
    const description = cleanText(req.body.description, 2000);
    const imageUrl = uploadPath(req) || cleanText(req.body.imageUrl, 1000);

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const existing = await pool.query("SELECT * FROM scrapbook_items WHERE id = ?", [id]);
    if (!existing[0].length) {
      return res.status(404).json({ message: "Scrapbook item not found" });
    }

    const prev = existing[0][0];
    const finalImage = imageUrl || prev.image_url;

    await pool.query(
      "UPDATE scrapbook_items SET title = ?, description = ?, image_url = ? WHERE id = ?",
      [title, description, finalImage, id]
    );

    const [rows] = await pool.query("SELECT * FROM scrapbook_items WHERE id = ?", [id]);
    res.json({ scrapbookItem: rows[0] });
  } catch (error) {
    console.error("Failed to update scrapbook item:", error);
    res.status(500).json({ message: "Failed to update scrapbook item", error: error.message });
  }
}

export async function deleteScrapbookItem(req, res) {
  try {
    const id = Number(req.params.id);
    const [existing] = await pool.query("SELECT * FROM scrapbook_items WHERE id = ?", [id]);

    if (!existing.length) {
      return res.status(404).json({ message: "Scrapbook item not found" });
    }

    const imageUrl = existing[0].image_url;
    await pool.query("DELETE FROM scrapbook_items WHERE id = ?", [id]);

    res.json({ ok: true, imageUrl });
  } catch (error) {
    console.error("Failed to delete scrapbook item:", error);
    res.status(500).json({ message: "Failed to delete scrapbook item" });
  }
}

export async function deletePhotoByUrl(req, res) {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required." });
    }

    await pool.query("DELETE FROM photos WHERE image_url = ?", [imageUrl]);
    await pool.query("DELETE FROM scrapbook_items WHERE image_url = ?", [imageUrl]);
    res.json({ ok: true, deletedUrl: imageUrl });
  } catch (error) {
    console.error("Failed to delete photo by URL:", error);
    res.status(500).json({ message: "Failed to delete photo" });
  }
}

export async function debugScrapbook(req, res) {
  try {
    const [photos] = await pool.query("SELECT id, uploader_name, caption, image_url, status, created_at FROM photos");
    const [scrapbookItems] = await pool.query("SELECT id, title, description, image_url, created_at FROM scrapbook_items");
    const [scrapbookEntries] = await pool.query("SELECT id, author_name, memory, image_url, status, created_at FROM scrapbook_entries");
    const [songs] = await pool.query("SELECT id, song_name, shared_by_name, thumbnail, created_at FROM songs");
    const [files] = await pool.query("SELECT id, filename FROM uploads");
    res.json({
      photos,
      scrapbookItems,
      scrapbookEntries,
      songs,
      files,
      _counts: {
        photos: photos.length,
        scrapbookItems: scrapbookItems.length,
        scrapbookEntries: scrapbookEntries.length,
        songs: songs.length
      }
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ message: "Debug failed", error: error.message });
  }
}

export async function listAllScrapbook(req, res) {
  try {
    const [photos] = await pool.query("SELECT id, uploader_name, uploader_email, caption, image_url, status, created_at FROM photos WHERE status = 'approved'");
    const [scrapbookEntries] = await pool.query(`
      SELECT se.*, s.song_name, s.artist, s.youtube_link, s.spotify_link, s.thumbnail
      FROM scrapbook_entries se
      LEFT JOIN songs s ON se.song_id = s.id
      WHERE se.status IN ('visible','featured')
    `);
    res.json({ photos, scrapbookEntries });
  } catch (error) {
    console.error("List scrapbook error:", error);
    res.status(500).json({ message: "Failed to list scrapbook" });
  }
}
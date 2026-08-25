// Direct cleanup script for scrapbook/image entries
// Run this with: node backend/scripts/cleanup_image.js

import pool from "./config/db.js";

async function cleanupImageEntries() {
  try {
    console.log("Checking for image.png entries...\n");
    
    const [photos] = await pool.query("SELECT id, uploader_name, image_url, created_at FROM photos WHERE image_url LIKE '%image.png%'");
    console.log("Found in photos table:", photos.length, "entries");
    photos.forEach(p => console.log(`  - ID: ${p.id}, URL: ${p.image_url}`));
    
    const [scrapbookItems] = await pool.query("SELECT id, title, image_url, created_at FROM scrapbook_items WHERE image_url LIKE '%image.png%'");
    console.log("\nFound in scrapbook_items table:", scrapbookItems.length, "entries");
    scrapbookItems.forEach(s => console.log(`  - ID: ${s.id}, URL: ${s.image_url}`));
    
    const [scrapbookEntries] = await pool.query("SELECT id, author_name, image_url, created_at FROM scrapbook_entries WHERE image_url LIKE '%image.png%'");
    console.log("\nFound in scrapbook_entries table:", scrapbookEntries.length, "entries");
    scrapbookEntries.forEach(s => console.log(`  - ID: ${s.id}, URL: ${s.image_url}`));
    
    const [songs] = await pool.query("SELECT id, song_name, thumbnail, created_at FROM songs WHERE thumbnail LIKE '%image.png%'");
    console.log("\nFound in songs table:", songs.length, "entries");
    songs.forEach(s => console.log(`  - ID: ${s.id}, Thumbnail: ${s.thumbnail}`));
    
    console.log("\nDeleting entries...");
    await pool.query("DELETE FROM photos WHERE image_url LIKE '%image.png%'");
    await pool.query("DELETE FROM scrapbook_items WHERE image_url LIKE '%image.png%'");
    await pool.query("DELETE FROM scrapbook_entries WHERE image_url LIKE '%image.png%'");
    await pool.query("DELETE FROM songs WHERE thumbnail LIKE '%image.png%'");
    
    console.log("Cleanup complete!");
  } catch (error) {
    console.error("Cleanup error:", error);
  } finally {
    process.exit(0);
  }
}

cleanupImageEntries();
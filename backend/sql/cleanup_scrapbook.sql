-- Direct cleanup queries for scrapbook items and photos
-- Run these in MySQL to remove orphaned/unwanted entries

-- Delete specific image file from photos table
DELETE FROM photos WHERE image_url LIKE '%image.png%';

-- Delete specific image file from scrapbook_items table
DELETE FROM scrapbook_items WHERE image_url LIKE '%image.png%';

-- Delete specific image file from scrapbook_entries table
DELETE FROM scrapbook_entries WHERE image_url LIKE '%image.png%';

-- List all entries with image.png to verify
SELECT id, uploader_name, image_url, created_at FROM photos WHERE image_url LIKE '%image.png%';
SELECT id, title, image_url, created_at FROM scrapbook_items WHERE image_url LIKE '%image.png%';
SELECT id, author_name, image_url, created_at FROM scrapbook_entries WHERE image_url LIKE '%image.png%';

-- Remove all test/placeholder entries (optional cleanup)
DELETE FROM photos WHERE image_url LIKE '%test%' OR image_url LIKE '%placeholder%';
DELETE FROM scrapbook_items WHERE title LIKE '%test%' OR title LIKE '%Test%';
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), "backend", ".env") });
dotenv.config();

const DB_NAME = process.env.DB_NAME || "plush_brew_db";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const dbCredentials = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

const pool = mysql.createPool({
  ...dbCredentials,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let isDbReady = false;

function getFallbackResult(sql) {
  const normalizedSql = String(sql).trim().toLowerCase();
  if (normalizedSql.startsWith("insert")) {
    return [{ insertId: 0, affectedRows: 0 }, {}];
  }
  if (normalizedSql.startsWith("update") || normalizedSql.startsWith("delete")) {
    return [{ affectedRows: 0 }, {}];
  }
  return [[], {}];
}

const dbClient = {
  query: async (sql, params) => {
    if (!isDbReady) {
      console.warn("Database is unavailable; returning empty demo-mode results for:", String(sql).split("\n")[0]);
      return getFallbackResult(sql);
    }
    return pool.query(sql, params);
  },
};

export async function ensureUsersTable() {
  try {
    const connection = await mysql.createConnection(dbCredentials);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.end();

    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(64) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    try {
      await pool.query("ALTER TABLE users ADD COLUMN role VARCHAR(64) DEFAULT 'user'");
    } catch (e) {
      // Column already exists, safe to ignore
    }

    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await pool.query(
        `
          INSERT INTO users (name, email, password_hash, role)
          VALUES (?, ?, ?, 'admin')
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            password_hash = VALUES(password_hash)
        `,
        ["Admin", ADMIN_EMAIL.toLowerCase(), passwordHash]
      );
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        user_id INT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        order_type ENUM('Online', 'Walk-in') DEFAULT 'Online',
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        gst DECIMAL(10,2) NOT NULL DEFAULT 0,
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        special_instructions TEXT NULL,
        estimated_prep_time VARCHAR(64) DEFAULT '20-25 minutes',
        status ENUM('Received','In Progress','Served','Cancelled') DEFAULT 'Received',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      item_id VARCHAR(255) NULL,
      item_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
      customization JSON NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id VARCHAR(64) PRIMARY KEY,
      user_id INT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      phone VARCHAR(64) NULL,
      reservation_date DATE NOT NULL,
      reservation_time VARCHAR(32) NOT NULL,
      guests INT NOT NULL DEFAULT 2,
      seat_type VARCHAR(128) DEFAULT 'Plush Lounge',
      area_preference VARCHAR(128) DEFAULT 'Indoor',
      special_requests TEXT NULL,
      status ENUM('Pending','Confirmed','Completed','Cancelled') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cloud_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      author_name VARCHAR(255) NOT NULL,
      author_email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      message_type ENUM('Message','Quote','Dreams','Gratitude','Wish','Memory') DEFAULT 'Message',
      status ENUM('visible','hidden','deleted') DEFAULT 'visible',
      report_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS photos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      uploader_name VARCHAR(255) NOT NULL,
      uploader_email VARCHAR(255) NOT NULL,
      caption TEXT NULL,
      image_url VARCHAR(1000) NOT NULL,
      status ENUM('pending','approved','hidden','deleted') DEFAULT 'approved',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      vehicle_name VARCHAR(255) NOT NULL,
      vehicle_type VARCHAR(128) NOT NULL,
      vehicle_photo VARCHAR(1000) NULL,
      owner_name VARCHAR(255) NOT NULL,
      owner_email VARCHAR(255) NOT NULL,
      status ENUM('pending','approved','hidden','deleted') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reporter_email VARCHAR(255) NULL,
      target_type ENUM('cloud_message','photo','vehicle') NOT NULL,
      target_id INT NOT NULL,
      reason TEXT NOT NULL,
      status ENUM('open','reviewed','resolved') DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      recipient_email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      template_name VARCHAR(128) NOT NULL,
      related_type VARCHAR(64) NULL,
      related_id VARCHAR(64) NULL,
      payload JSON NULL,
      status ENUM('queued','sent','failed') DEFAULT 'queued',
      error_message TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      admin_email VARCHAR(255) NOT NULL,
      action VARCHAR(128) NOT NULL,
      target_type VARCHAR(64) NOT NULL,
      target_id VARCHAR(64) NOT NULL,
      notes TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(128) NOT NULL,
        sender ENUM('user', 'bot') NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session_id (session_id),
        INDEX idx_timestamp (timestamp)
      )
    `);

    isDbReady = true;
  } catch (error) {
    isDbReady = false;
    console.warn("Database unavailable; continuing in demo mode.", error.message);
  }
}

export { isDbReady };
export default dbClient;
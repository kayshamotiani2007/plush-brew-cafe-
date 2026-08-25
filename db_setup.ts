
import mysql, { OkPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import { curatedMenuItems } from './src/data/menu.ts';
import { initialBookings, initialReviews, initialOrders, initialLoyaltyTracks } from './src/data/mockData.ts';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  // database: 'plushbrew_db' // Don't specify database initially for creation
};

const DB_NAME = process.env.DB_NAME || 'plush_brew_db';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'kayshamotiani2007@gmail.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 'kaysha@1101';

async function setupDatabase() {
  let connection;
  try {
    // Connect without a specific database to create it first
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log('Connected to MySQL server.');

    // Create the database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`Database '${DB_NAME}' ensured to exist.`);

    // Close the initial connection and open a new one with the specific database
    await connection.end();
    
    connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: DB_NAME,
    });
    console.log(`Connected to database '${DB_NAME}'.`);

    // --- Table creation SQL ---
    const createTablesSQL = `
      -- Table for users
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for menu items
      CREATE TABLE IF NOT EXISTS menu_items (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        category VARCHAR(255),
        image VARCHAR(255),
        season VARCHAR(255),
        is_bestseller BOOLEAN DEFAULT FALSE
      );

      -- Table for bookings
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        date DATE NOT NULL,
        time TIME NOT NULL,
        guests INT NOT NULL,
        notes TEXT,
        status ENUM('Confirmed', 'Pending', 'Cancelled', 'Completed') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for reviews
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for orders
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id INT,
        customer_name VARCHAR(255),
        subtotal DECIMAL(10, 2) NOT NULL,
        gst DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        type ENUM('Walk-in', 'Online') DEFAULT 'Walk-in',
        status ENUM('In Progress', 'Received', 'Served', 'Cancelled') DEFAULT 'Received',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );

      -- Table for order items (details of items within an order)
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        menu_item_id VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price_at_order DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
      );

      -- Table for loyalty cards
      CREATE TABLE IF NOT EXISTS loyalty_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        stamps_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Table for loyalty history (individual stamps/items earned)
      CREATE TABLE IF NOT EXISTS loyalty_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        loyalty_card_id INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        stamped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (loyalty_card_id) REFERENCES loyalty_cards(id) ON DELETE CASCADE
      );
    `;
    
    await connection.execute(createTablesSQL);
    console.log('All tables created or already exist. ☕');

    // Insert menu items
    for (const item of curatedMenuItems) {
        const [rows] = await connection.execute('SELECT id FROM menu_items WHERE id = ?', [item.id]);
        if (Array.isArray(rows) && rows.length === 0) {
            await connection.execute(
                'INSERT INTO menu_items (id, name, price, description, category, image, season, is_bestseller) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [item.id, item.name, item.price, item.description || null, item.category || null, item.image || null, item.season || null, item.isBestseller || false]
            );
        }
    }
    console.log('Menu items inserted or already exist. 🧋');

    // Insert bookings
    for (const booking of initialBookings) {
        const [rows] = await connection.execute('SELECT id FROM bookings WHERE id = ?', [booking.id]);
        if (Array.isArray(rows) && rows.length === 0) {
            await connection.execute(
                'INSERT INTO bookings (id, name, email, phone, date, time, guests, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [booking.id, booking.name, booking.email, booking.phone || null, booking.date, booking.time, booking.guests, booking.notes || null, booking.status, booking.createdAt]
            );
        }
    }
    console.log('Bookings inserted or already exist. 🎀');

    // Insert reviews
    for (const review of initialReviews) {
        const [rows] = await connection.execute('SELECT id FROM reviews WHERE id = ?', [review.id]);
        if (Array.isArray(rows) && rows.length === 0) {
            await connection.execute(
                'INSERT INTO reviews (id, name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)',
                [review.id, review.name, review.rating, review.comment || null, review.createdAt]
            );
        }
    }
    console.log('Reviews inserted or already exist. ✨');

    // Admin user insertion (already exists, but ensuring loyalty card for admin)
    let adminUserId: number | undefined;
    const [userRows] = await connection.execute('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);
    if (Array.isArray(userRows) && userRows.length === 0) {
        const [insertResult] = await connection.execute(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [ADMIN_EMAIL, ADMIN_PASSWORD_HASH, 'admin']
        );
        adminUserId = (insertResult as OkPacket).insertId;
        console.log(`Admin user '${ADMIN_EMAIL}' inserted.`);
    } else {
        adminUserId = (userRows[0] as any).id;
        console.log(`Admin user '${ADMIN_EMAIL}' already exists.`);
    }

    // Ensure loyalty card for admin user
    if (adminUserId) {
        const [loyaltyRows] = await connection.execute('SELECT id FROM loyalty_cards WHERE user_id = ?', [adminUserId]);
        if (Array.isArray(loyaltyRows) && loyaltyRows.length === 0) {
            await connection.execute(
                'INSERT INTO loyalty_cards (user_id, email, phone, stamps_count) VALUES (?, ?, ?, ?)',
                [adminUserId, ADMIN_EMAIL, '+91 91192 33445', 5] // Using mock phone and stamps
            );
            console.log(`Loyalty card created for admin user '${ADMIN_EMAIL}'.`);
        } else {
            console.log(`Loyalty card for admin user '${ADMIN_EMAIL}' already exists.`);
        }
    }

    console.log('Database setup complete! ✨');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed.');
    }
  }
}

setupDatabase();

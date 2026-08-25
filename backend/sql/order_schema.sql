-- Plush Brew Database Schema - Order Receipt System
-- Database: plush_brew_db

-- Users table (for authentication and customer tracking)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(64) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main orders table - stores order receipt details
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
);

-- Order items table - stores individual items within each order
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  item_id VARCHAR(255) NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  customization JSON NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Sample INSERT for order receipt
-- INSERT INTO orders (id, user_id, customer_name, customer_email, order_type, subtotal, gst, total, special_instructions) 
-- VALUES ('ORD-12345', NULL, 'Rahul Sharma', 'rahul@example.com', 'Online', 450.00, 81.00, 531.00, 'Extra hot matcha latte');

-- Sample INSERT for order items
-- INSERT INTO order_items (order_id, item_id, item_name, quantity, unit_price, customization) 
-- VALUES ('ORD-12345', 'matcha-latte', 'Strawberry Cloud Matcha Latte', 1, 360.00, '{"sweetness":"Normal","ice":"Normal"}');

-- Query to fetch all orders with their items for the admin panel queue
SELECT 
  o.id AS order_id,
  o.customer_name,
  o.customer_email,
  o.order_type,
  o.subtotal,
  o.gst,
  o.total,
  o.status,
  o.created_at,
  oi.id AS item_id,
  oi.item_name,
  oi.quantity,
  oi.unit_price AS item_price,
  oi.customization
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC;

-- Query to fetch orders queue with aggregated items (for display)
SELECT 
  o.id,
  o.customer_name,
  o.customer_email,
  o.order_type,
  o.subtotal,
  o.gst,
  o.total,
  o.status,
  o.created_at,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'id', oi.item_id,
      'name', oi.item_name,
      'quantity', oi.quantity,
      'unitPrice', oi.unit_price,
      'customization', oi.customization
    )
  ) AS items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC;
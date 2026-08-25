import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool, { isDbReady } from "../config/db.js";

const TOKEN_EXPIRES_IN = "7d";
const JWT_SECRET = String(process.env.JWT_SECRET || "plush-brew-local-secret");
process.env.JWT_SECRET = JWT_SECRET;
const demoUsers = new Map();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'user',
    created_at: user.created_at,
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role || "user", created_at: user.created_at || new Date().toISOString() },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function getDemoUser(email) {
  return demoUsers.get(normalizeEmail(email));
}

export async function register(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    if (!isDbReady) {
      const existingDemoUser = getDemoUser(email);
      if (existingDemoUser) {
        return res.status(409).json({ message: "This email is already registered." });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const demoUser = {
        id: Date.now(),
        name,
        email,
        password_hash: passwordHash,
        role: "user",
        created_at: new Date().toISOString(),
      };
      demoUsers.set(email, demoUser);

      const token = generateToken(demoUser);
      return res.status(201).json({ token, user: publicUser(demoUser) });
    }

    const [existingUsers] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existingUsers.length) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    const user = { id: result.insertId, name, email };
    const token = generateToken(user);

    return res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed. Please try again." });
  }
}

export async function login(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!isDbReady) {
      const demoUser = getDemoUser(email);
      if (!demoUser) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const passwordMatches = await bcrypt.compare(password, demoUser.password_hash);
      if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = generateToken(demoUser);
      return res.json({ token, user: publicUser(demoUser) });
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);
    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export async function logout(req, res) {
  // JWT logout is client-driven; the frontend removes the stored token.
  return res.json({ message: "Logged out successfully." });
}

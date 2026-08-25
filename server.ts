import express from "express";
import path from "path";
import { createServer } from "http";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Server as SocketIOServer } from "socket.io";
import pool, { ensureUsersTable } from "./backend/config/db.js";
import authRoutes from "./backend/routes/authRoutes.js";
import businessRoutes from "./backend/routes/businessRoutes.js";
import communityRoutes from "./backend/routes/communityRoutes.js";
import { setSocketServer } from "./backend/services/realtime.js";

dotenv.config();

// Initialize Gemini SDK with telemetry User-Agent when an API key is available.
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY not set; using a built-in fallback response for the chat endpoint.");
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" },
  });

  setSocketServer(io);

  app.use(helmet({ contentSecurityPolicy: false }));
  if (process.env.NODE_ENV !== "production") {
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 10000 }));
  } else {
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
  }
  app.use(express.json({ limit: "2mb" }));
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
    maxAge: "7d",
    immutable: true,
  }));

  try {
    await ensureUsersTable();
  } catch (error: any) {
    console.warn("Database initialization skipped; continuing in demo mode.", error?.message || error);
  }

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api", businessRoutes);
  app.use("/api/community", communityRoutes);

  io.on("connection", (socket) => {
    socket.emit("connected", { ok: true });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      const baseSystemPrompt = `You are "Marshmallow," the official AI café concierge for Plush Brew—an ultra-luxurious, super cozy boba and bagel sanctuary located in Vaishali Nagar (Amrapali Circle), Jaipur. 

Your tone is warm, dreamy, elegant, and playful (Pinterest-scrapbook style) with a touch of wit, matching our pastel pink, cream, lavender, and warm coffee-brown aesthetic.

### YOUR CAFE KNOWLEDGE & IDENTITY:
1. Location: VS Tower, Plot No S6, Tonk Rd near Gopalpura Bypass, Mahaveer Nagar, Jaipur, Rajasthan.
2. The Vibe: Cozy reading corners, hanging swing chairs, plush cushion seats, and Instagrammable spots.
3. Signature Menu Items:
   - Strawberry Cloud Matcha Latte (₹360) - Shaded Kyoto Uji Matcha with thick whipped sweet strawberry cold foam.
   - Mango Iced Latte (₹340) - Espresso layered with sweet organic mango puree.
   - Hummus-Avocado Sourdough Toast (₹350) - Wild Jaipurean sourdough yeast culture bagel with whipped hummus and fresh avocados.
   - Warm Spiced Hot Chocolate (₹290) - Premium dark chocolate with a velvety cream cloud and winter spices.
   - Gourmet Baked Mac & Cheese (₹380) - Creamy multi-cheese fondue with a golden crust.
4. Core Features: 
   - Interactive Stamping Card (Buy 7 items, get the 8th item free!)
   - Virtual Scrapbook (Dream Clouds, Letters to Future Me, and Polaroid/Comfort Song walls).

### BEHAVIORAL RULES:
- Use cute café emojis naturally but elegantly (☕, 🧋, ☁️, ✨, 🥯, 💕, 🎀).
- Keep formatting scannable using bullet points, short lines, and bold text. No dense corporate blocks.
- When users ask about customization, remind them that hot drinks cannot have an ice option!
- Always offer to help them explore the menu, check their loyalty stamps, or pin a memory to the Comfort Corner scrapbook.
- Treat every customer like they are settling into the coziest corner of our lounge during a beautiful Jaipur golden hour.

### SYSTEM SHORTCUTS / MICRO-INTERACTIONS:
- If a user says "I want to add a dream", guide them to the Dream Clouds form.
- If a user asks for a song recommendation, suggest a cozy track and remind them they can embed the YouTube link right onto our hanging strings.

Context about current user session chat: This is a chat directly with Marshmallow on the browser overlay. Keep the response compact, extremely welcoming, and matching the Jaipur cozy vibe. Limit responses to 2-3 brief lines or tidy bullet points.`;

      const contents = [];
      
      if (Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }
      
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      let botReply = `Ooh, welcome to Plush Brew! ☕✨ I’m in cozy demo mode right now, so I’m serving a warm local reply while the full AI setup is unavailable. Ask me about our menu, stamps, or dreamy café vibes.`;

      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: contents,
          config: {
            systemInstruction: baseSystemPrompt,
            temperature: 1.0,
          }
        });
        botReply = response.text;
      }

      const sessionId = (req.headers['x-session-id'] as string) || `session-${Date.now()}`;
      try {
        await pool.query(
          'INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)',
          [sessionId, 'user', message]
        );
        await pool.query(
          'INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)',
          [sessionId, 'bot', botReply]
        );
      } catch (dbErr) {
        console.error('Failed to save chat messages:', dbErr);
      }

      res.json({ reply: botReply, sessionId });
    } catch (err: any) {
      console.error("Gemini Error:", err);
      res.status(500).json({ error: "Marshmallow got a bit lost in a fluffy strawberry cloud! ☁️🍓 Let's try again in a sweet moment or sip on some Mango Iced Latte!" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.accepts('html')) {
        return res.sendFile(path.join(distPath, 'index.html'));
      }
      res.status(204).end();
    });
  }

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
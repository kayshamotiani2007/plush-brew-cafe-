import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createCloudMessage,
  createPhoto,
  createScrapbookEntry,
  createVehicle,
  listCommunityContent,
  moderateContent,
  reportContent,
} from "../controllers/communityController.js";
import {
  listScrapbookItems,
  createScrapbookItem,
  updateScrapbookItem,
  deleteScrapbookItem,
  deletePhotoByUrl,
  debugScrapbook,
  listAllScrapbook,
} from "../controllers/scrapbookController.js";

const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
      cb(new Error("Only JPG, PNG, WEBP, or GIF images are allowed."));
      return;
    }
    cb(null, true);
  },
});

const router = express.Router();

router.get("/", listCommunityContent);
router.get("/scrapbook-items", listScrapbookItems);
router.post("/cloud-messages", createCloudMessage);
router.post("/photos", upload.single("image"), createPhoto);
router.post("/vehicles", upload.single("image"), createVehicle);
router.post("/scrapbook", upload.single("image"), createScrapbookEntry);
router.post("/reports", reportContent);
router.post("/admin/scrapbook-items", authMiddleware, adminMiddleware, upload.single("image"), createScrapbookItem);
router.put("/admin/scrapbook-items/:id", authMiddleware, adminMiddleware, upload.single("image"), updateScrapbookItem);
router.delete("/admin/scrapbook-items/:id", authMiddleware, adminMiddleware, deleteScrapbookItem);
router.delete("/admin/photos/by-url", authMiddleware, adminMiddleware, deletePhotoByUrl);
router.patch("/admin/:targetType/:id", authMiddleware, adminMiddleware, moderateContent);
router.get("/debug/scrapbook", debugScrapbook);

export default router;
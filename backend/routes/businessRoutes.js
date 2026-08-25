import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder, createReservation, listAdminData, updateOrderStatus } from "../controllers/businessController.js";

const router = express.Router();

router.post("/orders", createOrder);
router.post("/reservations", createReservation);
router.get("/admin/data", authMiddleware, adminMiddleware, listAdminData);
router.patch("/orders/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;

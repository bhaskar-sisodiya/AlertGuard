// routes/userRoutes.js
import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

// Use memory storage for avatar uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", protect, getUserProfile);
router.put("/", protect, upload.single("avatar"), updateUserProfile);

export default router;

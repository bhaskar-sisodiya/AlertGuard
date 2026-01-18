// controllers/userController.js

import {
  getUserProfileById,
  updateUserProfileById,
} from "../services/userService.js";

import { validateAvatar, validateAvatarUpload } from "../validators/userValidator.js";
import { uploadAvatarImage } from "../utils/uploadAvatar.js";

/**
 * GET /api/users/profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserProfileById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/**
 * PUT /api/users/profile
 * Update user profile (with or without avatar upload)
 */
export const updateUserProfile = async (req, res) => {
  try {
    console.log("Update profile request body:", req.body);
    console.log("User ID:", req.user?._id);
    
    // Handle avatar upload if file is present
    if (req.file) {
      const fileCheck = validateAvatarUpload(req);
      if (!fileCheck.ok) {
        return res.status(fileCheck.status).json({ message: fileCheck.message });
      }

      try {
        // Upload to Supabase
        const avatarUrl = await uploadAvatarImage(fileCheck.imageBuffer, fileCheck.mimeType);
        req.body.avatar = avatarUrl;
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload avatar image" });
      }
    } else if (req.body.avatar) {
      // Validate avatar if provided in body (predefined avatar or URL)
      const avatarCheck = validateAvatar(req.body.avatar);
      if (!avatarCheck.ok) {
        return res.status(avatarCheck.status).json({ message: avatarCheck.message });
      }
      req.body.avatar = avatarCheck.value;
    }

    const result = await updateUserProfileById(req.user._id, req.body);

    if (!result) return res.status(404).json({ message: "User not found" });

    if (result.error) {
      console.error("Profile update error:", result.error);
      return res.status(result.error.status).json({ message: result.error.message });
    }

    res.json({
      message: "Profile updated successfully",
      user: result.user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};

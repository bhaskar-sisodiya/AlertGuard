// services/userService.js
import User from "../models/User.js";
import { normalizeLocationKey, toTitleCase } from "../utils/locationUtils.js";

export const getUserProfileById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  
  // Normalize role to lowercase for consistency
  if (user && user.role) {
    user.role = user.role.toLowerCase();
  }
  
  return user;
};

export const updateUserProfileById = async (userId, body) => {
  const user = await User.findById(userId);
  if (!user) return null;

  // Normalize role to lowercase for consistency
  if (user.role) {
    user.role = user.role.toLowerCase();
  }

  // ✅ USERNAME UPDATE (unique check)
  if (body.username && body.username !== user.username) {
    const usernameExists = await User.findOne({ username: body.username });

    if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
      return { error: { status: 400, message: "Username already taken" } };
    }

    user.username = body.username;
  }

  // ✅ SAFE FIELDS
  user.phone = body.phone ?? user.phone;
  user.gender = body.gender ?? user.gender;

  // ✅ LOCATION
  if (body.location !== undefined) {
    user.location = body.location ? toTitleCase(body.location) : "";
    user.locationKey = body.location ? normalizeLocationKey(body.location) : "";
  }

  // ✅ AVATAR (validation handled by validator/controller)
  if (body.avatar) {
    user.avatar = body.avatar;
  }

  const updatedUser = await user.save();

  return {
    user: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      location: updatedUser.location,
      locationKey: updatedUser.locationKey,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      isAdmin: updatedUser.role?.toLowerCase() === 'admin',
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  };
};

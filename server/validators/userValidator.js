// validators/userValidator.js
export const validateAvatar = (avatar) => {
  const allowedAvatars = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5", "male", "female", "default"];

  if (!avatar) return { ok: true, value: null };

  // Allow predefined avatars
  if (allowedAvatars.includes(avatar)) {
    return { ok: true, value: avatar };
  }

  // Allow URLs (uploaded images from Supabase or other sources)
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return { ok: true, value: avatar };
  }

  return { ok: false, status: 400, message: "Invalid avatar - must be a predefined avatar or valid URL" };
};

export const validateAvatarUpload = (req) => {
  if (!req.file) {
    return { ok: false, status: 400, message: "Avatar image file is required" };
  }

  const imageBuffer = req.file.buffer;
  const mimeType = req.file.mimetype;

  const supportedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!supportedTypes.includes(mimeType)) {
    return {
      ok: false,
      status: 400,
      message: `Unsupported format: ${mimeType}. Please upload JPEG, PNG, or WebP.`,
    };
  }

  // Check file size (5MB max)
  if (req.file.size > 5 * 1024 * 1024) {
    return {
      ok: false,
      status: 400,
      message: "Avatar image must be less than 5MB",
    };
  }

  return { ok: true, imageBuffer, mimeType };
};

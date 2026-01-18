// middleware/roleMiddleware.js

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (!req.user.role) {
      return res.status(403).json({ message: "Access denied. Role missing." });
    }

    // Case-insensitive role check
    const userRole = req.user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

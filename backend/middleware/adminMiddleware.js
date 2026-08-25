export function adminMiddleware(req, res, next) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!adminEmail || req.user?.email?.toLowerCase() !== adminEmail) {
    return res.status(403).json({ message: "Admin access is required." });
  }
  next();
}

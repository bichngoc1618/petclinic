const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Không có token" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", decoded); // ✅ đây là chỗ bạn cần
      req.user = decoded;

      // Kiểm tra role nếu có
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
};

module.exports = authMiddleware;

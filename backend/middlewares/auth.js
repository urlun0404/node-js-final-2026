const { findUserById } = require("../repositories/user");
const { verifyToken } = require("../utils/token");

async function getUserForAuth(id) {
  const user = await findUserById(id);
  if (!user) return null;

  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "failed", message: "請先登入" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await getUserForAuth(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "使用者不存在" });
    }

    req.user = user;
    next();
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(401)
      .json({ status: "failed", message: "Token 無效或已過期" });
  }
}

module.exports = authMiddleware;

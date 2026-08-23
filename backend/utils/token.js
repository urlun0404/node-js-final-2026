const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  const expiresIn = process.env.JWT_EXPIRES_DAY || "30d";

  const payload = {
    id: user.id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(payload, SECRET, { expiresIn });

  return token;
}

function verifyToken(token) {
  const decoded = jwt.verify(token, SECRET);
  return decoded;
}

module.exports = {
  generateToken,
  verifyToken,
};

require("dotenv").config();
const jwt = require("jsonwebtoken");

async function generateToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_DAY || "30d";

  const token = jwt.sign(payload, jwtSecret, { expiresIn });

  return token;
}

module.exports = {
  generateToken,
};

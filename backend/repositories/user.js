const db = require("../db");

async function findUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function findUserById(id) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function saveNewUser(user) {
  const result = await db.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name",
    [user.name, user.email, user.password],
  );
  return result.rows[0];
}

async function updateUserName(userId, newName) {
  const result = await db.query(
    "UPDATE users SET name = $1 WHERE id = $2 RETURNING name",
    [newName, userId],
  );
  return result.rows[0];
}

async function updateUserRule(userId, newRole) {
  return db.query("UPDATE users SET role = $1 WHERE id = $2 RETURNING *", [
    newRole,
    userId,
  ]);
}

async function updateUserPassword(userId, newPassword) {
  return db.query("UPDATE users SET password = $1 WHERE id = $2 RETURNING id", [
    newPassword,
    userId,
  ]);
}

module.exports = {
  findUserByEmail,
  findUserById,
  saveNewUser,
  updateUserName,
  updateUserRule,
  updateUserPassword,
};

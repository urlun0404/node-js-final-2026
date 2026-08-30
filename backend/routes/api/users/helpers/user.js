const data = [];

async function findUserByEmail(email) {
  return data.find((item) => item.email === email);
}

async function getUserHashedPassword(email) {
  const user = await findUserByEmail(email);
  return user ? user.password : null;
}

async function saveNewUser(user) {
  data.push(user);
}

async function updateUserPassword(email, newPassword) {
  const user = await findUserByEmail(email);
  if (user) {
    user.password = newPassword;
  }
}

module.exports = {
  findUserByEmail,
  getUserHashedPassword,
  saveNewUser,
  updateUserPassword,
};

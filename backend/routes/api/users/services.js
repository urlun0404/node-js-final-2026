const { findUserByEmail } = require("../../../repositories/user");

async function getUserHashedPassword(foundUser) {
  let user = foundUser;

  if (!user || !user.password) {
    user = await findUserByEmail(foundUser.email);
  }

  return user ? user.password : null;
}

module.exports = {
  getUserHashedPassword,
};

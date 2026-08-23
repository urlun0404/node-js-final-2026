const express = require("express");
const router = express.Router();
const { comparePassword } = require("../../../utils/password");
const { generateToken } = require("../../../utils/token");
const { isValidEmail, isValidPassword } = require("../../../utils/validation");
const { findUserByEmail } = require("../../../repositories/user");
const { getUserHashedPassword } = require("./services");

// 會員登入
router.post("/", async (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (!email || !password || !isValidEmail(email)) {
    return res
      .status(400)
      .json({ status: "failed", message: "欄位未填寫正確" });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      status: "failed",
      message: "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字",
    });
  }

  const existingUser = await findUserByEmail(email);
  const isUnmatchedUser = !existingUser;
  if (isUnmatchedUser) {
    return res
      .status(400)
      .json({ status: "failed", message: "使用者不存在或密碼輸入錯誤" });
  }

  const hashedPassword = await getUserHashedPassword(existingUser);
  const isUnmatchedPassword = !(await comparePassword(
    password,
    hashedPassword,
  ));
  if (isUnmatchedPassword) {
    return res
      .status(400)
      .json({ status: "failed", message: "使用者不存在或密碼輸入錯誤" });
  }

  const token = generateToken(existingUser);
  return res.status(200).json({
    status: "success",
    data: {
      token,
      user: {
        name: existingUser.name,
      },
    },
  });
});

module.exports = router;

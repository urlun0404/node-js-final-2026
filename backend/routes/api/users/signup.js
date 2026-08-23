const express = require("express");
const router = express.Router();
const { createHashPassword } = require("../../../utils/password");
const { isValidEmail, isValidPassword } = require("../../../utils/validation");
const { findUserByEmail, saveNewUser } = require("../../../repositories/user");

// 註冊新會員帳號
router.post("/", async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (!name || !email || !password || !isValidEmail(email)) {
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
  const isExistingUser = !!existingUser;
  if (isExistingUser) {
    return res
      .status(409)
      .json({ status: "failed", message: "Email 已被使用" });
  }

  const hashedPassword = await createHashPassword(password);
  const newUser = {
    name,
    email,
    password: hashedPassword,
  };
  const savedUser = await saveNewUser(newUser);

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: savedUser.id,
        name: savedUser.name,
      },
    },
  });
});

module.exports = router;

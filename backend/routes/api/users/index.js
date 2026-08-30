const express = require("express");
const router = express.Router();
const {
  findUserByEmail,
  getUserHashedPassword,
  saveNewUser,
} = require("./helpers/user");
const { comparePassword, createHashPassword } = require("./helpers/password");
const { generateToken } = require("./helpers/token");
const { isValidEmail, isValidPassword } = require("./helpers/validation");

const profileRouter = require("./profile");

router.use("/profile", profileRouter);

// 註冊新會員帳號
router.post("/signup", async (req, res) => {
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
    id: require("uuid").v4(),
    name,
    email,
    password: hashedPassword,
  };
  await saveNewUser(newUser);

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
      },
    },
  });
});

// 會員登入
router.post("/login", async (req, res) => {
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

  const hashedPassword = await getUserHashedPassword(email);
  const isUnmatchedPassword = !(await comparePassword(
    password,
    hashedPassword,
  ));
  if (isUnmatchedPassword) {
    return res
      .status(400)
      .json({ status: "failed", message: "使用者不存在或密碼輸入錯誤" });
  }

  const token = await generateToken(existingUser);
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

// 修改本人的登入密碼
router.put("/password", async (req, res) => {
  const password = req.body.password?.trim();
  const newPassword = req.body.new_password?.trim();
  const confirmNewPassword = req.body.confirm_new_password?.trim();

  if (!password || !newPassword || !confirmNewPassword) {
    return res
      .status(400)
      .json({ status: "failed", message: "欄位未填寫正確" });
  }

  if (
    !isValidPassword(password) ||
    !isValidPassword(newPassword) ||
    !isValidPassword(confirmNewPassword)
  ) {
    return res.status(400).json({
      status: "failed",
      message: "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字",
    });
  }

  // 新密碼與舊密碼不可相同
  if (newPassword === password) {
    return res
      .status(400)
      .json({ status: "failed", message: "新密碼不可與舊密碼相同" });
  }

  // 新密碼與確認新密碼須一致
  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ status: "failed", message: "新密碼與驗證新密碼不一致" });
  }

  // TODO: 從已登入使用者去找密碼
  // 舊密碼比對錯誤
  const hashedPassword = await getUserHashedPassword(req.user.email);
  const isUnmatchedPassword = !(await comparePassword(
    password,
    hashedPassword,
  ));
  if (isUnmatchedPassword) {
    return res.status(400).json({ status: "failed", message: "舊密碼不正確" });
  }

  const newHashedPassword = await createHashPassword(newPassword);
  await updateUserPassword(req.user.email, newHashedPassword);

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = router;

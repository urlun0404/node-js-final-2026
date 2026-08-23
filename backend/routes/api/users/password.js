const express = require("express");
const router = express.Router();
const {
  comparePassword,
  createHashPassword,
} = require("../../../utils/password");
const { isValidPassword } = require("../../../utils/validation");
const { updateUserPassword } = require("../../../repositories/user");
const { getUserHashedPassword } = require("./services");

// 修改本人的登入密碼
router.put("/", async (req, res) => {
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

  // 舊密碼比對錯誤
  const loginUser = req.user;
  const hashedPassword = await getUserHashedPassword(loginUser);
  const isUnmatchedPassword = !(await comparePassword(
    password,
    hashedPassword,
  ));
  if (isUnmatchedPassword) {
    return res.status(400).json({ status: "failed", message: "密碼輸入錯誤" });
  }

  const newHashedPassword = await createHashPassword(newPassword);
  const result = await updateUserPassword(loginUser.id, newHashedPassword);

  if (result.rowCount === 0) {
    return res
      .status(500)
      .json({ status: "failed", message: "密碼更新失敗，請稍後再試。" });
  }

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { updateUserName, findUserById } = require("../../../repositories/user");

// 取得本人的個人資料
router.get("/", (req, res) => {
  const user = req.user;

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
});

// 更改本人的暱稱
router.put("/", async (req, res) => {
  const newName = req.body.name?.trim();

  if (!newName) {
    return res
      .status(400)
      .json({ status: "failed", message: "欄位未填寫正確" });
  }

  try {
    const user = req.user;
    const userId = user.id;

    const foundUser = await findUserById(userId);
    const oldName = foundUser.name;
    if (oldName === newName) {
      return res
        .status(400)
        .json({ status: "failed", message: "使用者名稱未變更" });
    }

    const updatedUser = await updateUserName(userId, newName);

    res.status(200).json({
      status: "success",
      data: {
        user: {
          name: updatedUser.name,
        },
      },
    });
  } catch (error) {
    console.error("Error updating user name:", error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "更新使用者資料失敗" });
  }
});

module.exports = router;

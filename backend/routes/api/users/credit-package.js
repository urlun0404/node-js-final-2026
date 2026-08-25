const express = require("express");
const router = express.Router();
const {
  findBookingCreditPackagesByUserId,
} = require("../../../repositories/booking");

// 取得本人的購買方案紀錄
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await findBookingCreditPackagesByUserId(userId);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "取得資料失敗，請稍候再試。" });
  }
});

module.exports = router;

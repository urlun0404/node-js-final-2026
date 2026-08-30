const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../../middlewares/auth");
const coachMiddleware = require("../../../../middlewares/coach");
const { findCoachMonthRevenue } = require("../../../../repositories/coach");

const VALID_CHAR_MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// @params {string} month: january, february, march, april, may, june, july, august, september, october, november, december
router.get("/", authMiddleware, coachMiddleware, async (req, res) => {
  const month = req.query.month?.toLowerCase();

  if (!month || !VALID_CHAR_MONTHS.includes(month)) {
    return res.status(400).json({
      status: "failed",
      message: "欄位未填寫正確",
    });
  }

  try {
    const result = await findCoachMonthRevenue(req.user.id, month);
    res.status(200).json({
      status: "success",
      data: {
        total: result,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "伺服器錯誤",
    });
  }
});

module.exports = router;

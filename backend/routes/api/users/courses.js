const express = require("express");
const router = express.Router();
const {
  findEnrolledCoursesByUserId,
} = require("../../../repositories/enrollment");

// 取得本人的課表與剩餘堂數
router.get("/", async (req, res) => {
  const userId = req.user.id;
  const data = await findEnrolledCoursesByUserId(userId);
  res.status(200).json({ status: "success", data });
});

module.exports = router;

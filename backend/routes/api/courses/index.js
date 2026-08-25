const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middlewares/auth");
const {
  foundUserRemainingPurchasedCredits,
} = require("../../../repositories/booking");
const {
  findCourseById,
  findOngoingCourses,
} = require("../../../repositories/course");
const {
  findEnrolledCourseByUserIdWithCourseId,
  getEnrolledParticipantsByCourseId,
  saveEnrolledCourse,
  cancellUserEnrolledCourse,
} = require("../../../repositories/enrollment");

router.get("/", async (req, res) => {
  const courses = await findOngoingCourses();
  res.status(200).json({
    status: "success",
    data: courses,
  });
});

router.post("/:courseId", authMiddleware, async (req, res) => {
  const courseId = req.params.courseId;

  const foundCourse = await findCourseById(courseId);
  if (!foundCourse) {
    return res.status(400).json({ status: "failed", message: "ID錯誤" });
  }

  const userId = req.user.id;

  // 已有此課程的報名紀錄（含已取消）
  const result = await findEnrolledCourseByUserIdWithCourseId(userId, courseId);
  if (result.rowCount > 0) {
    return res
      .status(400)
      .json({ status: "failed", message: "已經報名過此課程" });
  }

  // 剩餘堂數歸零（購買堂數加總 − 未取消報名數 ≤ 0，沒買過方案也算）
  const remainingCredits = await foundUserRemainingPurchasedCredits(userId);
  if (remainingCredits <= 0) {
    return res
      .status(400)
      .json({ status: "failed", message: "已無可使用堂數" });
  }

  // 課程有效報名人數已達上限
  const courseEnrolledParticipants =
    await getEnrolledParticipantsByCourseId(courseId);
  if (courseEnrolledParticipants >= foundCourse.max_participants) {
    return res
      .status(400)
      .json({ status: "failed", message: "已達最大參加人數，無法參加" });
  }

  const newBooking = await saveEnrolledCourse(req.user.id, {
    id: req.params.courseId,
  });

  if (!newBooking) {
    return res
      .status(500)
      .json({ status: "failed", message: "報名失敗，請稍候再試。" });
  }

  res.status(201).json({ status: "success", data: null });
});

router.delete("/:courseId", authMiddleware, async (req, res) => {
  const { courseId } = req.params;

  // 找不到課程
  const foundCourse = await findCourseById(courseId);
  if (!foundCourse) {
    return res.status(400).json({ status: "failed", message: "ID錯誤" });
  }

  // 使用者未報名該課

  const userId = req.user.id;

  const foundUserEnrolledCourse = await findEnrolledCourseByUserIdWithCourseId(
    userId,
    courseId,
  );

  const isUnenrolled = foundUserEnrolledCourse.rowCount <= 0;
  const isCancelled = foundUserEnrolledCourse.rows[0].cancelled_at !== null; // 課程已取消

  if (isUnenrolled || isCancelled) {
    return res.status(400).json({ status: "failed", message: "ID錯誤" });
  }

  const result = await cancellUserEnrolledCourse(userId, courseId);

  if (result.affected === 0) {
    return res.status(400).json({ status: "failed", message: "課程取消失敗" });
  }

  // 成功取消該課程
  res.status(200).json({ status: "success", data: null });
});

module.exports = router;

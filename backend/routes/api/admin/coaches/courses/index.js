const express = require("express");
const router = express.Router();
const coachMiddleware = require("../../../../../middlewares/coach");
const {
  findCourseById,
  findCoursesByUserId,
  saveNewCourse,
  updateCourseById,
} = require("../../../../../repositories/course");
const { checkCourseRequiredFields } = require("./helpers");

// 取得教練本人開設的全部課程列表
router.get("/", coachMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const courses = await findCoursesByUserId(user.id);

    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: "failed", message: "取得課程列表失敗，請稍候再試。" });
  }
});

// 教練開設的新課程
router.post("/", coachMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    if (!checkCourseRequiredFields(payload)) {
      return res
        .status(400)
        .json({ status: "failed", message: "缺少必填欄位" });
    }
    const user = req.user;
    const newCourse = await saveNewCourse({
      ...payload,
      user_id: user.id,
    });
    res.status(200).json({
      status: "success",
      data: {
        course: newCourse,
      },
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: "failed", message: "新增資料失敗，請稍候再試。" });
  }
});

// 取得單一課程詳情
router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;

  const course = await findCourseById(courseId);

  const user = req.user;
  if (!course || course.user_id !== user.id) {
    return res.status(400).json({ status: "failed", message: "課程不存在" });
  }

  res.status(200).json({
    status: "success",
    data: course,
  });
});

// 更新單一課程
router.put("/:courseId", async (req, res) => {
  if (!checkCourseRequiredFields(req.body)) {
    return res.status(400).json({ status: "failed", message: "缺少必填欄位" });
  }

  const { courseId } = req.params;
  const course = await findCourseById(courseId);

  const user = req.user;
  if (!course || course.user_id !== user.id) {
    return res.status(400).json({ status: "failed", message: "課程不存在" });
  }

  const updatedCourse = await updateCourseById(courseId, req.body);
  res.status(200).json({
    status: "success",
    data: updatedCourse,
  });
});

module.exports = router;

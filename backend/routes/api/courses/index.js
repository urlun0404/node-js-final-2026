const express = require("express");
const router = express.Router();
const { findOngoingCourses } = require("../../../repositories/course");

router.get("/", async (req, res) => {
  const courses = await findOngoingCourses();
  res.status(200).json({
    status: "success",
    data: courses,
  });
});

module.exports = router;

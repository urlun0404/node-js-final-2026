const express = require("express");
const router = express.Router();
const {
  findCoachesWithUserName,
  findCoachById,
} = require("../../../repositories/coach");
const {
  findUnfinishedCoursesByUserId,
} = require("../../../repositories/course");
const { findSkillNameByIds } = require("../../../repositories/skill");
const { findUserById } = require("../../../repositories/user");
const {
  isValidNumber,
  isValidNonEmptyString,
} = require("../../../utils/validation");

const skillRouter = require("./skill");

router.use("/skill", skillRouter);

router.get("/", async (req, res) => {
  const page = Number(req.query.page);
  const per = Number(req.query.per);

  if (!isValidNumber(per) || !isValidNumber(page)) {
    return res.status(400).json({
      status: "failed",
      message: "欄位未填寫正確",
    });
  }

  const results = await findCoachesWithUserName(per, page);

  res.status(200).json({
    status: "success",
    data: results,
  });
});

router.get("/:coachId", async (req, res) => {
  const { coachId } = req.params;

  if (!isValidNonEmptyString(coachId)) {
    return res
      .status(400)
      .json({ status: "failed", message: "欄位未填寫正確" });
  }

  const foundCoach = await findCoachById(coachId);
  if (!foundCoach) {
    return res.status(400).json({ status: "failed", message: "找不到該教練" });
  }

  const user = await findUserById(foundCoach.user_id);

  const skills = await findSkillNameByIds(foundCoach.skill_ids);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        name: user.name,
        role: user.role,
      },
      coach: {
        id: foundCoach.id,
        user_id: foundCoach.user_id,
        experience_years: foundCoach.experience_years,
        description: foundCoach.description,
        profile_image_url: foundCoach.profile_image_url,
        created_at: foundCoach.created_at,
        updated_at: foundCoach.updated_at,
        skills,
      },
    },
  });
});

router.get("/:coachId/courses", async (req, res) => {
  const { coachId } = req.params;

  if (!isValidNonEmptyString(coachId)) {
    return res
      .status(400)
      .json({ status: "failed", message: "欄位未填寫正確" });
  }

  const foundCoach = await findCoachById(coachId);
  if (!foundCoach) {
    return res.status(400).json({ status: "failed", message: "找不到該教練" });
  }

  const results = await findUnfinishedCoursesByUserId(foundCoach.user_id);

  res.status(200).json({
    status: "success",
    data: results,
  });
});

module.exports = router;

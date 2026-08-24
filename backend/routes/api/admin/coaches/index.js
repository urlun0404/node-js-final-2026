const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../../middlewares/auth");
const coachMiddleware = require("../../../../middlewares/coach");
const {
  findUserById,
  updateUserRule,
} = require("../../../../repositories/user");
const {
  findCoachByUserId,
  saveNewCoach,
  updateCoachById,
} = require("../../../../repositories/coach");
const { isValidNumber } = require("../../../../utils/validation");

const coursesRouter = require("./courses");

router.use("/courses", authMiddleware, coursesRouter);

// 將指定使用者升級為教練
router.post("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const foundUser = await findUserById(userId);

    if (foundUser.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "使用者不存在",
      });
    }

    if (foundUser.role === "COACH") {
      return res.status(409).json({
        status: "failed",
        message: "使用者已經是教練",
      });
    }

    const { experience_years, profile_image_url } = req.body;

    const description = req.body.description?.trim();

    const hasInvalidProfileImageUrl =
      profile_image_url &&
      typeof profile_image_url === "string" &&
      profile_image_url.trim() &&
      !profile_image_url.startsWith("https");

    if (
      !isValidNumber(experience_years) ||
      !description ||
      hasInvalidProfileImageUrl
    ) {
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
    }

    const updateResult = await updateUserRule(userId, "COACH");

    if (!updateResult || updateResult.rowCount === 0) {
      return res.status(500).json({
        status: "failed",
        message: "更新使用者角色失敗，請稍候再試。",
      });
    }

    const newCoach = await saveNewCoach({
      user_id: userId,
      experience_years,
      description,
      profile_image_url: profile_image_url ?? null,
    });

    const updatedUser = updateResult.rows[0];
    res.status(201).json({
      status: "success",
      data: {
        user: {
          name: updatedUser.name,
          role: updatedUser.role,
        },
        coach: newCoach,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "更新使用者資料失敗，請稍候再試。" });
  }
});

// 取得教練本人的後台資料（含技能清單）
router.get("/", authMiddleware, coachMiddleware, async (req, res) => {
  const user = req.user;
  try {
    const foundCoach = await findCoachByUserId(user.id);

    if (!foundCoach) {
      return res.status(404).json({
        status: "failed",
        message: "教練資料不存在",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        id: foundCoach.id,
        experience_years: foundCoach.experience_years,
        description: foundCoach.description,
        profile_image_url: foundCoach.profile_image_url,
        skill_ids: foundCoach.skill_ids,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "取得教練資料失敗，請稍候再試。" });
  }
});

// 更新教練本人的後台資料（含整批更換既譨）
router.put("/", authMiddleware, coachMiddleware, async (req, res) => {
  const { experience_years, skill_ids } = req.body;

  const description = req.body.description?.trim();
  const profile_image_url = req.body?.profile_image_url?.trim();

  const isInvalidSkillIds =
    skill_ids && Array.isArray(skill_ids) && skill_ids.length < 1;

  if (
    !isValidNumber(experience_years) ||
    !description ||
    !profile_image_url ||
    !profile_image_url.startsWith("https") ||
    isInvalidSkillIds
  ) {
    return res.status(400).json({
      status: "failed",
      message: "欄位未填寫正確",
    });
  }

  const user = req.user;
  const foundCoach = await findCoachByUserId(user.id);

  const updatedCoach = await updateCoachById(foundCoach.id, {
    experience_years,
    description,
    profile_image_url: profile_image_url ?? null,
    skill_ids,
  });

  res.status(200).json({
    status: "success",
    data: updatedCoach,
  });
});

module.exports = router;

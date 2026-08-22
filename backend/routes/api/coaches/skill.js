const express = require("express");
const router = express.Router();
const {
  deleteSkillById,
  findAllSkills,
  saveNewSkill,
} = require("../../../repositories/skill");

// 取得教練技能列表
router.get("/", async (req, res) => {
  try {
    const skills = await findAllSkills();
    res.status(200).json({ status: "success", data: skills });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "取得資料失敗，請稍候再試。" });
  }
});

// 新增教練技能
router.post("/", async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) {
    return res
      .status(400)
      .json({ status: "failed", message: "欄位未填寫正確" });
  }

  const existingSkills = await findAllSkills();
  if (
    existingSkills.length > 0 &&
    existingSkills.some(
      (skill) => skill.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    return res.status(409).json({ status: "failed", message: "資料重複" });
  }

  try {
    const newSkill = { name };
    const savedSkill = await saveNewSkill(newSkill);

    res.status(201).json({ status: "success", data: savedSkill });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "新增資料失敗，請稍候再試。" });
  }
});

// 刪除教練技能
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: "failed", message: "ID 為必填欄位。" });
  }

  try {
    const result = await deleteSkillById(id);
    if (result.affected === 0) {
      return res.status(404).json({ status: "failed", message: "ID錯誤" });
    }

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "刪除資料失敗，請稍候再試。" });
  }
});

module.exports = router;

const db = require("../db");

const { findUserById: _findUserById } = require("./user");

const data = [
  {
    id: "a1c5e8f2-3b7d-4e9a-8c6f-2d4b9e1a7c3f",
    user_id: "f3b7d2c1-8a4e-4c6f-9d2b-5e1a7c3f9b8d",
    experience_years: 3,
    description: "瑜伽與皮拉提斯雙修，擅長帶初學者",
    profile_image_url: "https://example.com/avatar.png",
    created_at: "2026-08-20T10:00:00.000Z",
    updated_at: "2026-08-20T10:00:00.000Z",
    // foreign key
    skill_ids: [
      "2a4b6c8d-1e2f-4a5b-9c8d-0e1f2a3b4c5d",
      "5f0faccc-5a7b-4799-a2ae-9e17bbfd1b6b",
    ],
  },
];

async function findCoachByUserId(userId) {
  const foundCoachResult = await db.query(
    "SELECT * FROM coaches WHERE user_id = $1",
    [userId],
  );
  const foundSkillsResult = await db.query(
    "SELECT skill_id FROM coach_skills WHERE user_id = $1",
    [foundCoachResult.rows[0].id],
  );
  const foundCoach = foundCoachResult.rows[0];
  return {
    id: foundCoach.id,
    experience_years: foundCoach.experience_years,
    description: foundCoach.description,
    profile_image_url: foundCoach.profile_image_url,
    skill_ids: foundSkillsResult.rows,
  };
}

async function saveNewCoach(coach) {
  const result = await db.query(
    "INSERT INTO coaches (user_id, experience_years, description, profile_image_url) VALUES ($1, $2, $3, $4) RETURNING id, user_id, experience_years, description, profile_image_url, description, created_at, updated_at",
    [
      coach.user_id,
      coach.experience_years,
      coach.description,
      coach.profile_image_url,
    ],
  );
  return result.rows[0];
}

// FIX: 修正 insert or update on table "coach_skills" violates foreign key constraint "coach_skills_user_id_fkey"
async function updateCoachById(coachId, updatedData) {
  const updateCoachResult = await db.query(
    "UPDATE coaches SET experience_years = $2, description = $3, profile_image_url = $4, updated_at = NOW() WHERE id = $1 RETURNING *",
    [
      coachId,
      updatedData.experience_years,
      updatedData.description,
      updatedData.profile_image_url,
    ],
  );

  const updatedCoach = updateCoachResult.rows[0];

  const userId = updatedCoach.user_id;
  if (updatedData.skill_ids && updatedData.skill_ids.length > 0) {
    const deleteCoachSkillsResult = await db.query(
      "DELETE FROM coach_skills WHERE user_id = $1",
      [userId],
    );

    const insertSkillsPromises = updatedData.skill_ids.map((skillId) =>
      db.query("INSERT INTO coach_skills (user_id, skill_id) VALUES ($1, $2)", [
        userId,
        skillId,
      ]),
    );
    await Promise.all(insertSkillsPromises);
  }

  const updatedCoachSkillsResult = await db.query(
    "SELECT ARRAY_AGG(skill_id) FROM coach_skills WHERE user_id = $1",
    [userId],
  );

  return {
    id: updatedCoach.id,
    experience_years: updatedCoach.experience_years,
    description: updatedCoach.description,
    profile_image_url: updatedCoach.profile_image_url,
    skill_ids: updatedCoachSkillsResult.rows[0].array_agg,
  };
}

module.exports = {
  findCoachByUserId,
  saveNewCoach,
  updateCoachById,
};

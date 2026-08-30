const db = require("../db");

const data = [
  {
    id: "2a4b6c8d-1e2f-4a5b-9c8d-0e1f2a3b4c5d",
    name: "重訓",
    createdAt: "2026-06-10T08:00:00.000Z",
  },
];

async function findAllSkills() {
  const result = await db.query("SELECT id, name FROM skills");
  return result.rows;
}

async function findSkillById(skillId) {
  return db.query("SELECT id, name FROM skills WHERE id = $1", [skillId]);
}

async function findSkillNameByIds(skillIds) {
  const result = await db.query(
    "SELECT ARRAY_AGG(name) AS skill_names FROM skills WHERE id = ANY($1)",
    [skillIds],
  );
  return result.rows[0].skill_names ?? [];
}

async function saveNewSkill(skill) {
  const results = await db.query(
    "INSERT INTO skills (name) VALUES ($1) RETURNING *",
    [skill.name],
  );
  return results.rows[0];
}

async function deleteSkillById(skillId) {
  const result = await db.query(
    "DELETE FROM skills WHERE id = $1 RETURNING *",
    [skillId],
  );
  return { raw: result.rows, affected: result.rowCount };
}

module.exports = {
  findAllSkills,
  findSkillById,
  findSkillNameByIds,
  saveNewSkill,
  deleteSkillById,
};

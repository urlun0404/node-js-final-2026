const db = require("../db");

async function findCoachById(coachId) {
  const result = await db.query("SELECT * FROM coaches WHERE id = $1", [
    coachId,
  ]);
  return result.rows[0] ?? null;
}

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

async function findCoachesWithUserName(per, page) {
  const result = await db.query(
    "SELECT c.id, c.user_id, u.name FROM coaches c JOIN users u ON c.user_id = u.id LIMIT $1 OFFSET $2",
    [per, (page - 1) * per],
  );
  return result.rows;
}

const CHAR_MONTH_TO_NUMBER = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

// 教練今年當月營收。lowerCharMonth 為英文小寫月份（例：june = 今年 6 月）。
async function findCoachMonthRevenue(coachUserId, lowerCharMonth) {
  const monthNumber = CHAR_MONTH_TO_NUMBER[lowerCharMonth];
  if (!monthNumber) {
    return 0;
  }

  const coachCoursesResult = await db.query(
    "SELECT id FROM courses WHERE user_id = $1",
    [coachUserId],
  );
  const courseIds = coachCoursesResult.rows.map((row) => row.id);
  if (courseIds.length === 0) {
    return {
      revenue: 0,
      participants: 0,
      course_count: 0,
    };
  }

  const enrollmentCountResult = await db.query(
    "SELECT COUNT(*) AS count, COUNT(DISTINCT user_id) AS participants FROM enrollments WHERE cancelled_at IS NULL AND course_id = ANY($1) AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW()) AND EXTRACT(MONTH FROM created_at) = $2",
    [courseIds, monthNumber],
  );

  // enrollmentCount = 該月未取消報名筆數
  const enrollmentCount = parseInt(enrollmentCountResult.rows[0].count, 10);

  // participantCount = 該月不重複的報名學員數（同一人報多堂算 1 人）
  const participantCount = parseInt(
    enrollmentCountResult.rows[0].participants,
    10,
  );

  if (enrollmentCount === 0) {
    return {
      revenue: 0,
      participants: 0,
      course_count: 0,
    };
  }

  // 單堂均價 = 全部方案的 Σprice ÷ Σcredit_amount
  const avgResult = await db.query(
    "SELECT SUM(price) AS total_price, SUM(credit_amount) AS total_credit FROM packages",
  );
  const totalPrice = parseInt(avgResult.rows[0].total_price, 10) || 0;
  const totalCredit = parseInt(avgResult.rows[0].total_credit, 10) || 0;
  if (totalCredit === 0) {
    return {
      revenue: 0,
      participants: 0,
      course_count: 0,
    };
  }
  const avgPricePerCredit = totalPrice / totalCredit;

  // 營收 = floor(該月未取消報名筆數 × 單堂均價)
  const revenue = Math.floor(enrollmentCount * avgPricePerCredit);
  return {
    revenue,
    participants: participantCount,
    course_count: enrollmentCount,
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
  findCoachById,
  findCoachByUserId,
  findCoachesWithUserName,
  findCoachMonthRevenue,
  saveNewCoach,
  updateCoachById,
};

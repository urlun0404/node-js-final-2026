const db = require("../db");

async function findCourseById(courseId) {
  const foundCourseResult = await db.query(
    "SELECT c.*, s.name AS skill_name FROM courses c JOIN skills s ON c.skill_id = s.id WHERE c.id = $1",
    [courseId],
  );
  return foundCourseResult.rows[0];
}

async function findCoursesByUserId(userId) {
  const participantsQuery =
    "SELECT course_id, COUNT(*) AS participants FROM enrollments WHERE cancelled_at IS NULL GROUP BY course_id";

  const results = await db.query(
    `SELECT c.id, c.name, c.start_at, c.end_at, c.max_participants, c.meeting_url,
            CASE WHEN c.start_at > NOW() THEN '尚未開始'
                 WHEN c.start_at <= NOW() AND c.end_at > NOW() THEN '進行中'
                 ELSE '已結束' END AS status,
            COALESCE(p.participants, 0) AS participants
       FROM courses c
       LEFT JOIN (${participantsQuery}) p ON c.id = p.course_id
      WHERE c.user_id = $1`,
    [userId],
  );

  return results.rows;
}

async function findUnfinishedCoursesByUserId(userId) {
  const result = await db.query(
    "SELECT c.*, s.name AS skill_name, u.name AS coach_name FROM courses c JOIN skills s ON c.skill_id = s.id JOIN users u ON c.user_id = u.id WHERE c.user_id = $1 AND c.end_at > NOW()",
    [userId],
  );
  return result.rows;
}

async function findOngoingCourses() {
  const result = await db.query(
    "SELECT c.*, s.name AS skill_name, u.name AS coach_name FROM courses c JOIN skills s ON c.skill_id = s.id JOIN users u ON c.user_id = u.id WHERE c.start_at <= NOW() AND c.end_at > NOW()",
  );

  return result.rows;
}

async function saveNewCourse(course) {
  const result = await db.query(
    "INSERT INTO courses (user_id, skill_id, name, description, start_at, end_at, max_participants, meeting_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      course.user_id,
      course.skill_id,
      course.name,
      course.description,
      course.start_at,
      course.end_at,
      course.max_participants,
      course.meeting_url,
    ],
  );
  return result.rows[0];
}

async function updateCourseById(courseId, updatedData) {
  const result = await db.query(
    "UPDATE courses SET skill_id = $2, name = $3, description = $4, start_at = $5, end_at = $6, max_participants = $7, meeting_url = $8, updated_at = NOW() WHERE id = $1 RETURNING *",
    [
      courseId,
      updatedData.skill_id,
      updatedData.name,
      updatedData.description,
      updatedData.start_at,
      updatedData.end_at,
      updatedData.max_participants,
      updatedData.meeting_url,
    ],
  );
  return result.rows[0];
}

module.exports = {
  findCourseById,
  findCoursesByUserId,
  findUnfinishedCoursesByUserId,
  findOngoingCourses,
  saveNewCourse,
  updateCourseById,
};

const db = require("../db");

async function findEnrolledCourseByUserIdWithCourseId(userId, courseId) {
  const result = await db.query(
    "SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2",
    [userId, courseId],
  );
  const rows = result.rows;
  return {
    command: "SELECT",
    rowCount: rows.length,
    rows: rows,
  };
}

async function findEnrolledCoursesByUserId(userId) {
  const result = await db.query(
    "SELECT e.course_id, c.name, c.start_at, c.end_at, c.meeting_url, u.name AS coach_name, e.cancelled_at FROM enrollments e JOIN courses c ON e.course_id = c.id JOIN users u ON c.user_id = u.id WHERE e.user_id = $1 ORDER BY c.start_at ASC",
    [userId],
  );
  const courseBooking = result.rows;

  const bookingResult = await db.query(
    "SELECT SUM(pkg.credit_amount) AS total_credits FROM bookings pb JOIN packages pkg ON pb.package_id = pkg.id WHERE pb.user_id = $1",
    [userId],
  );
  const totalCredits = parseInt(bookingResult.rows[0].total_credits, 10) || 0;

  const enrolledCourses = await db.query(
    "SELECT COUNT(*) AS enrolled_count FROM enrollments WHERE user_id = $1 AND cancelled_at IS NULL",
    [userId],
  );
  const enrolledCount = parseInt(enrolledCourses.rows[0].enrolled_count, 10);

  return {
    credit_remain: totalCredits - enrolledCount,
    credit_usage: enrolledCount,
    course_booking: courseBooking,
  };
}

async function getEnrolledParticipantsByCourseId(courseId) {
  const result = await db.query(
    "SELECT COUNT(*) AS enrolled_count FROM enrollments WHERE course_id = $1 AND cancelled_at IS NULL",
    [courseId],
  );
  return parseInt(result.rows[0].enrolled_count, 10);
}

async function saveEnrolledCourse(userId, course) {
  const result = await db.query(
    "INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *",
    [userId, course.id],
  );
  return result.rows[0];
}

async function cancellUserEnrolledCourse(userId, courseId) {
  const result = await db.query(
    "UPDATE enrollments SET cancelled_at = NOW() WHERE user_id = $1 AND course_id = $2 RETURNING *",
    [userId, courseId],
  );

  const softDeletedCourse = result.rows[0];
  if (!softDeletedCourse) {
    return { raw: [], affected: 0 };
  }
  return {
    raw: result.rows,
    affected: 1,
  };
}

module.exports = {
  findEnrolledCourseByUserIdWithCourseId,
  findEnrolledCoursesByUserId,
  getEnrolledParticipantsByCourseId,
  saveEnrolledCourse,
  cancellUserEnrolledCourse,
};

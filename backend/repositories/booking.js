const db = require("../db");

async function foundUserRemainingPurchasedCredits(userId) {
  const bookingResult = await db.query(
    "SELECT SUM(pkg.credit_amount) AS total_credits FROM bookings pb JOIN packages pkg ON pb.package_id = pkg.id WHERE pb.user_id = $1",
    [userId],
  );

  const uncancelledCoursesResult = await db.query(
    "SELECT COUNT(*) AS uncancelled_courses FROM enrollments WHERE user_id = $1 AND cancelled_at IS NULL",
    [userId],
  );

  const totalCredits = parseInt(bookingResult.rows[0].total_credits, 10) || 0;
  const totalUncancelledCourses =
    parseInt(uncancelledCoursesResult.rows[0].uncancelled_courses, 10) || 0;

  return totalCredits - totalUncancelledCourses;
}

async function findBookingCreditPackagesByUserId(userId) {
  const result = await db.query(
    "SELECT pkg.name, pkg.credit_amount AS purchased_credits, pkg.price AS price_paid, pb.purchase_at FROM bookings pb JOIN packages pkg ON pb.package_id = pkg.id WHERE pb.user_id = $1 ORDER BY pb.purchase_at DESC",
    [userId],
  );
  return result.rows;
}

async function saveNewBookingCreditPackage(userId, creditPackage) {
  const result = await db.query(
    "INSERT INTO bookings (user_id, package_id, purchase_at) VALUES ($1, $2, NOW()) RETURNING *",
    [userId, creditPackage.id],
  );
  return result.rows[0];
}

module.exports = {
  findBookingCreditPackagesByUserId,
  foundUserRemainingPurchasedCredits,
  saveNewBookingCreditPackage,
};

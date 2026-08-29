require("dotenv").config();

const db = require("./index");
const initializeDB = require("./init");

// 依賴反序：先刪有外鍵指向別人的，再刪被指向的（其實 CASCADE 已能處理，列全是為了清楚）
const tables = [
  "enrollments",
  "bookings",
  "coach_skills",
  "courses",
  "packages",
  "coaches",
  "users",
  "skills",
];

async function reset() {
  try {
    console.log("清空所有資料表...");
    await db.query(`DROP TABLE IF EXISTS ${tables.join(", ")} CASCADE;`);
    console.log("已清空，開始重建...");
    await initializeDB();
    console.log("重建完成");
  } catch (error) {
    console.error("重建失敗：\n", error);
    process.exitCode = 1;
  } finally {
    await db.pool.end();
  }
}

reset();

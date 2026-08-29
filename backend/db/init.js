const fs = require("fs");
const path = require("path");
const db = require("./index");

const filenameList = [
  "001-init-skills.sql",
  "002-init-users.sql",
  "003-init-coaches.sql",
  "004-init-coarses.sql",
  "005-init-packages.sql",
  "006-init-coach-skills.sql",
  "007-init-bookings.sql",
  "008-init-enrollments.sql",
];

async function initializeDB() {
  console.log(`開始初始化資料庫 ${process.env.DB_DATABASE}...`);

  for (const filename of filenameList) {
    const filePath = path.join(__dirname, "migrations", filename);
    const sql = fs.readFileSync(filePath, "utf-8");
    await db.query(sql);
    console.log(`已建立: ${filename}`);
  }

  console.log("資料庫初始化完成");
}

module.exports = initializeDB;

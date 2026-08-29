require("dotenv").config();

const app = require("./app");
const initializeDB = require("../db/init");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initializeDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("伺服器啟動失敗（資料庫初始化錯誤）：\n", error);
    process.exit(1);
  }
}

start();

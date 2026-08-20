const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("../routes");

// Middleware
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use(function (req, res, next) {
  res.status(404).json({ status: "failed", message: "找不到該路由" });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res
    .status(500)
    .json({ status: "failed", message: "伺服器發生錯誤，請稍候再試。" });
});

module.exports = app;

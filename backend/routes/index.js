const express = require("express");
const router = express.Router();

const healthCheckRouter = require("./health-check");

router.use("/healthcheck", healthCheckRouter);

module.exports = router;

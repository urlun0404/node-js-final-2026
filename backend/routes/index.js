const express = require("express");
const router = express.Router();

const healthCheckRouter = require("./health-check");
const apiRouter = require("./api");

router.use("/healthcheck", healthCheckRouter);
router.use("/api", apiRouter);

module.exports = router;

const express = require("express");
const router = express.Router();

const coachesRouter = require("./coaches");

router.use("/coaches", coachesRouter);

module.exports = router;

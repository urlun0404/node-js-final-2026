const express = require("express");
const router = express.Router();

const coachesRouter = require("./coaches");
const creditPackageRouter = require("./credit-package");

router.use("/coaches", coachesRouter);
router.use("/credit-package", creditPackageRouter);

module.exports = router;

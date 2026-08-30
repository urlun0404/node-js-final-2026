const express = require("express");
const router = express.Router();

const coachesRouter = require("./coaches");
const creditPackageRouter = require("./credit-package");
const usersRouter = require("./users");

router.use("/coaches", coachesRouter);
router.use("/credit-package", creditPackageRouter);
router.use("/users", usersRouter);

module.exports = router;

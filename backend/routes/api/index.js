const express = require("express");
const router = express.Router();

const adminRouter = require("./admin");
const coachesRouter = require("./coaches");
const coursesRouter = require("./courses");
const creditPackageRouter = require("./credit-package");
const usersRouter = require("./users");

router.use("/admin", adminRouter);
router.use("/coaches", coachesRouter);
router.use("/courses", coursesRouter);
router.use("/credit-package", creditPackageRouter);
router.use("/users", usersRouter);

module.exports = router;

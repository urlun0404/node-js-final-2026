const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middlewares/auth");

const coursesRouter = require("./courses");
const creditPackageRouter = require("./credit-package");
const loginRouter = require("./login");
const passwordRouter = require("./password");
const profileRouter = require("./profile");
const signupRouter = require("./signup");

router.use("/courses", authMiddleware, coursesRouter);
router.use("/credit-package", authMiddleware, creditPackageRouter);
router.use("/login", loginRouter);
router.use("/profile", authMiddleware, profileRouter);
router.use("/password", authMiddleware, passwordRouter);
router.use("/signup", signupRouter);

module.exports = router;

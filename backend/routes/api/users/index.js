const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middlewares/auth");

const loginRouter = require("./login");
const passwordRouter = require("./password");
const profileRouter = require("./profile");
const signupRouter = require("./signup");

router.use("/login", loginRouter);
router.use("/profile", authMiddleware, profileRouter);
router.use("/password", authMiddleware, passwordRouter);
router.use("/signup", signupRouter);

module.exports = router;

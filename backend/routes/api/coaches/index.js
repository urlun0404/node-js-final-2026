const express = require("express");
const router = express.Router();

const skillRouter = require("./skill");

router.use("/skill", skillRouter);

module.exports = router;

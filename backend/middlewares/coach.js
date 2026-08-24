async function coachMiddleware(req, res, next) {
  const user = req.user;

  if (user.role !== "COACH") {
    return res
      .status(403)
      .json({ status: "failed", message: "使用者尚未成為教練" });
  }

  next();
}

module.exports = coachMiddleware;

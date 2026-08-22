function isValidNumber(value) {
  return !isNaN(value) && typeof value === "number" && value > 0;
}

module.exports = {
  isValidNumber,
};

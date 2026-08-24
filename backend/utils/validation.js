function isValidDateTimeFormat(dateTimeString) {
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  return dateTimeRegex.test(dateTimeString);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidNumber(value) {
  return !isNaN(value) && typeof value === "number" && value > 0;
}

function isValidNonEmptyString(value) {
  return typeof value === "string" && value.trim();
}

function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
  return passwordRegex.test(password);
}

module.exports = {
  isValidDateTimeFormat,
  isValidEmail,
  isValidNonEmptyString,
  isValidNumber,
  isValidPassword,
};

const {
  isValidDateTimeFormat,
  isValidNonEmptyString,
  isValidNumber,
} = require("../../../../../utils/validation");

const requiredFields = [
  {
    name: "skill_id",
    valid(val) {
      return isValidNonEmptyString(val);
    },
  },
  {
    name: "name",
    valid(val) {
      return isValidNonEmptyString(val);
    },
  },
  {
    name: "description",
    valid(val) {
      return isValidNonEmptyString(val);
    },
  },
  {
    name: "start_at",
    valid(val) {
      const trimmedVal = val?.trim();
      return !!trimmedVal && isValidDateTimeFormat(trimmedVal);
    },
  },
  {
    name: "end_at",
    valid(val) {
      const trimmedVal = val?.trim();
      return !!trimmedVal && isValidDateTimeFormat(trimmedVal);
    },
  },
  {
    name: "max_participants",
    valid(val) {
      return isValidNumber(val);
    },
  },
  {
    name: "meeting_url",
    valid(val) {
      const trimmedVal = val?.trim();
      return (
        isValidNonEmptyString(trimmedVal) && trimmedVal.startsWith("https")
      );
    },
  },
];

function checkCourseRequiredFields(fields) {
  for (const field of requiredFields) {
    if (!fields[field.name] || !field.valid(fields[field.name])) {
      return false;
    }
  }

  return true;
}

module.exports = {
  checkCourseRequiredFields,
};

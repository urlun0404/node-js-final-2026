function hasDuplicateData(data, name) {
  return data.some((d) => d.name.toLowerCase() === name.toLowerCase());
}

module.exports = {
  hasDuplicateData,
};

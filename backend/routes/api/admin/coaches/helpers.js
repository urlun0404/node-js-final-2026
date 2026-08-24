function isValidProfileImageUrl(url) {
  return url && typeof url === "string" && url.startsWith("https");
}

module.exports = {
  isValidProfileImageUrl,
};

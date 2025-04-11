module.exports = {
  googleFactCheckApiKey: process.env.GOOGLE_FACT_CHECK_API_KEY,
  googleFactCheckApiUrl:
    "https://factchecktools.googleapis.com/v1alpha1/claims:search",
  allowedFileTypes: ["image/jpeg", "image/png", "image/gif"],
  maxFileSize: 5 * 1024 * 1024,
};

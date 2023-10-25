const asyncHandler = require('express-async-handler');

exports.log_in = asyncHandler(async (req, res, next) => {
  res.status(200).json({});
});

exports.sign_up = asyncHandler(async (req, res, next) => {
  res.status(200).json({});
});

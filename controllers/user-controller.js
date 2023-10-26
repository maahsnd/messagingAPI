const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

exports.view_user = asyncHandler(async (req, res, next) => {
  const user = await User.find({ username: req.params.username });
  if (!user) {
    res.status(400).json({ msg: 'User not found' });
    return;
  } else {
    res.status(200).json({ username, password });
    return;
  }
});

exports.edit_user = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username required')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).errors;
    if (errors) {
      res.status(401).json({ errors });
      return;
    }
    const user = await User.find({ username: req.params.username });
    const edited_user = new User({
      username: req.body.username,
      password: user.password,
      _id: user._id
    });
    await User.findByIdAndUpdate(user._id, edited_user, {});
    res.status(200).json({ username: edited_user.username });
  })
];

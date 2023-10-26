const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

exports.view_user = asyncHandler(async (req, res, next) => {
  const user = await User.find({ username: req.params.username });
  if (!user) {
    res.status(400).json({ msg: 'User not found' });
    return;
  } else {
    return res.status(200).json({ username: user[0].username });
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

    const usernameTaken = await User.findOne({ username: req.body.username });
    if (usernameTaken) {
      console.error('Username taken');
      res.status(401).json({
        errors: [{ msg: 'Username taken', path: 'username' }]
      });
      return;
    }
    if (errors.length) {
      console.error('err: ' + errors);
      res.status(401).json({ errors });
      return;
    }
    const user = await User.find({ username: req.params.username });
    const edited_user = new User({
      username: req.body.username,
      password: user[0].password,
      _id: user[0]._id
    });
    await User.findByIdAndUpdate(user[0]._id, edited_user, {});
    res.status(200).json({ username: edited_user.username });
  })
];

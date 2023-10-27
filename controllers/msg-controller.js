const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Thread = require('../models/Thread');
const Message = require('../models/Message');

exports.new_message = [
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('A blank message is no message indeed. Write something.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).errors;
    if (errors.length) {
      console.error('err: ' + errors);
      //may be necessary to send errors in {}
      res.status(401).json(errors);
      return;
    }

    //all must be passed via req.body
    const { text, from, to } = req.body;
    //if thread not passed, create new
    if (!req.body.thread) {
      req.body.thread = new Thread({
        users: [from, ...to]
      });
    }
    const message = new Message({
      text: text,
      from: from,
      to: to,
      thread: req.body.thread
    });
    try {
      await message.save();
      await Thread.findOneAndUpdate(
        { _id: req.body.thread._id },
        { $push: { messages: message } },
        { upsert: true, new: true }
      );
      return res.status(200);
    } catch (err) {
      console.error(err);
      errors.push(err);
      return res.status(500).json(errors);
    }
  })
];

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
    const { text, from, thread } = req.body;
    //remove sender from list of users to get recipients
    const to = req.body.to.filter((user) => {
      if (user._id != from._id) {
        return user;
      }
    });
    const message = new Message({
      text: text,
      from: from,
      to: to,
      thread: thread
    });
    try {
      await message.save();
      await Thread.findOneAndUpdate(
        { _id: thread },
        { $push: { messages: message } },
        {}
      );
      const updatedThread = await Thread.findOne({
        _id: thread
      })
        .populate('users')
        .populate({
          path: 'messages',
          populate: {
            path: 'from'
          }
        })
        .exec();
      return res.status(200).json(updatedThread);
    } catch (err) {
      console.error(err);
      errors.push(err);
      return res.status(500).json(errors);
    }
  })
];

exports.new_thread_and_message = [
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
    const thread = new Thread({
      users: [from, ...to]
    });
    const message = new Message({
      text: text,
      from: from,
      to: to,
      thread: thread._id
    });

    try {
      await message.save();
      thread.messages.push(message);
      if (req.body.name) {
        thread.name = req.body.name;
      }
      await thread.save();
      return res.status(200).json(thread);
    } catch (err) {
      console.error(err);
      errors.push(err);
      return res.status(500).json(errors);
    }
  })
];

exports.get_threads = asyncHandler(async (req, res, next) => {
  const threads = await Thread.find({ users: { $in: [req.params.username] } })
    .populate('users')
    .populate({
      path: 'messages',
      populate: {
        path: 'from'
      }
    }).sort('-time')
    .exec();
  if (!threads) {
    return res.status(400).json({ msg: 'No threads found' });
  } else {
    return res.status(200).json(threads);
  }
});

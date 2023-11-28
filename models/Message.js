const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: { type: String, required: true },
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  timestamp: { type: Date, default: Date.now },
  thread: { type: Schema.Types.ObjectId, ref: 'Thread', required: true }
});

module.exports = mongoose.model('Message', MessageSchema);

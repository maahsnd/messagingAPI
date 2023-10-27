const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  name: { type: Text, minLength: 1, maxLength: 50, required: false }
});

module.exports = mongoose.model('Thread', ThreadSchema);

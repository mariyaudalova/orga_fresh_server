const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErrorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    errorInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }
);

module.exports = Error = mongoose.model('error', ErrorSchema);

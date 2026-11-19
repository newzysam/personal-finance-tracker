const mongoose = require('mongoose');
const { NAME_PATTERN, isValidDate } = require('../utils/reportValidation');

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
    validate: {
      validator: value => NAME_PATTERN.test(value),
      message: 'Name must start with a letter and contain no numbers.'
    }
  },
  date: {
    type: Date,
    required: true,
    set: value => typeof value === 'string' && !isValidDate(value) ? new Date(NaN) : value
  }
}, { timestamps: true });

schema.index({ user: 1, date: -1 });
module.exports = mongoose.model('Transaction', schema);

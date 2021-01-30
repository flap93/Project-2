const { Schema, model } = require('mongoose');

const billSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name is required.'],
      unique: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required.'],
      
    },
    reminder: {
      type: Boolean,
      required: [true]
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);

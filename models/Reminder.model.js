const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const moment = require('moment');
// const cfg = require('../config');//check appt git for config file
const Twilio = require('twilio');

const reminderSchema = new Schema (
  {
  name: String,
  phoneNumber: String,
  notification: Number,
  timeZone: String,
  time: {type: Date, index: true},
  }
);



const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;

// const Movie = mongoose.model("Movie", movieSchema);
// module.exports = Movie;


// const { Schema, model } = require('mongoose');

// const billSchema = new Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       required: [true, 'name is required.'],
//       unique: true
//     },
//     dateDue: {
//       type: Date,
//       required: [true, 'Date is required.'],

//     },
//     reminder: {
//       type: Boolean,
//       required: [true]
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = model('User', userSchema);

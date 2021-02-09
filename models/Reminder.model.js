
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
// const process.env = require('../config');//check appointment git for config file
const Twilio = require('twilio');

const reminderSchema = new Schema (
  {
  name: String,
  phoneNumber: String,
  // notification: Number,
  // timeZone: String,
  reminderDate: {type: Date, default: Date.now},
  paymentDue: {type: Date, default: Date.now},
  ownerName: String
  }
);


const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;


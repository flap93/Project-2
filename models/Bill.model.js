const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
// const process.env = require('../config');//check appointment git for config file
const Twilio = require('twilio');

const billSchema = new Schema (
  {
  accountName: String,
  paymentDue: {type: Date, default: Date.now},
  reminder: { type: Boolean},
  reminders: [{type: Schema.Types.ObjectId, ref: "Reminder" }],
  ownerName: String
  }
);


const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;

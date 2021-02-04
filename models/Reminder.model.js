
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
// const process.env = require('../config');//check appointment git for config file
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
reminderSchema.methods.requiresNotification = (date) => {
  console.log(date);
  return Math.round(moment.duration(moment(this.time).tz(this.timeZone).utc()
                          .diff(moment(date).utc())
                        ).asMinutes()) === this.notification;

              
};

reminderSchema.statics.sendNotifications = (callback) => {
  // now
  const searchDate = new Date();
  Reminder
    .find()
    .then((reminders) => {
      // console.log(reminders);
      reminders = reminders.filter((reminder) => {
              return reminder.requiresNotification(searchDate);
      });
      if (reminders.length > 0) {
        sendNotifications(reminders);
      }
    });

    /**
    * Send messages to all reminder owners via Twilio
    * @param {array} reminders List of reminders.
    */
  sendNotifications = (reminders) => {
    const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    reminders.forEach((reminder) => {
        // Create options to send the message
        const options = {
            to: `+1 ${reminder.phoneNumber}`,
            from: process.env.TWIL_NUM,
            /* eslint-disable max-len */
            body: `Hi ${reminder.name}. Just a reminder that you have an reminder coming up.`,
            /* eslint-enable max-len */
        };

        // Send the message!
        client.messages
        .create(options, (err, response) => {
            if (err) {
                // Just log it for now
                console.error(err);
            } else {
                // Log the last few digits of a phone number
                let masked = reminder.phoneNumber.substr(0,
                    reminder.phoneNumber.length - 5);
                masked += '*****';
                console.log(`Message sent to ${masked}`);
            }
        });
    
    });

    // Don't wait on success/failure, just indicate all messages have been
    // queued for delivery
    if (callback) {
      callback.call();
    }
};
};

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;


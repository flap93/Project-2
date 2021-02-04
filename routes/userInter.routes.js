const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const Twilio = require('twilio');
const moment = require('moment');
const Reminder = require('../models/Reminder.model');

/* GET  user home page */
router.get('/userHome', (req, res) => res.render('users/user-home', { title:'hello this is a test' }));

//Get new bill page
router.get('/newBill', (req, res) => res.render('users/new-bill', { title:'this is where the form for the new bill is going to be ' }));

// router.post('/newBill', (req, res) => {

//   const { name, phoneNumber, time, notification, timeZone } = req.body;

//   Reminder
//   .methods
//   .requiresNotification = (date) => {
//     return Math.round(moment.duration(moment(this.time).tz(this.timeZone).utc()
//                             .diff(moment(date).utc())
//                             ).asMinutes()) === this.notification;
//   };
//   Reminder
//   .statics
//   .sendNotifications = (callback) => {
//   // now
//   const searchDate = new Date();
//   Reminder
//     .find()
//     .then((reminders) => {
//       reminders = reminders.filter((bill) => {
//               return bill.requiresNotification(searchDate);
//       });
//       if (reminders.length > 0) {
//         sendNotifications(bills);
//       }
//   });
//     /**
//   * Send messages to all bill owners via Twilio
//   * @param {array} reminders List of reminders.
//   */
//   const sendNotifications = (reminders) => {
//       const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//       reminders
//       .forEach((reminder) => {
//           // Create options to send the message
//           const options = {
//               to: `+ ${reminder.phoneNumber}`,
//               from:  process.env.TWIL_NUM,
//               /* eslint-disable max-len */
//               body: `Hi ${reminder.name}. Just a reminder that you have an bill coming up.`,
//               /* eslint-enable max-len */
//       };
//           // Send the message!
//           client.messages.create(options, (err, response) => {
//               if (err) {
//                   // Just log it for now
//                   console.error(err);
//               } else {
//                   // Log the last few digits of a phone number
//                   let masked = reminder.phoneNumber.substr(0,
//                     reminder.phoneNumber.length - 5);
//                   masked += '*****';
//                   console.log(`Message sent to ${masked}`);
//               }
//           });
//       });
//       // Don't wait on success/failure, just indicate all messages have been
//       // queued for delivery
//       if (callback) {
//         callback.call();
//       }
//   }
// };
// });





module.exports = router;

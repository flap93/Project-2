const express = require('express');
const momentTimeZone = require('moment-timezone');
const moment = require('moment');
const Reminder = require("../models/Reminder.model");
const twilio = require('twilio');

const router = express.Router();
var cron = require('node-cron');

const getTimeZones = () => {
  return momentTimeZone.tz.names();
};


// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });


// GET: /reminders
router.get('/reminders', (req, res, next) => {
  Reminder.find()
  .then((reminders) => {
      res.render('users/user-home', {reminders: reminders});
    });
});

// GET: /reminders/create
router.get('/create', (req, res, next) => {
  res.render('reminders/create', {
    timeZones: getTimeZones(),
    reminder: new Reminder({name: '',
                                  phoneNumber: '',
                                  notification: '',
                                  timeZone: '',
                                  time: ''})});
// next(console.log(`llllllllllllllllllllll${getTimeZones()}`));
});


// POST: /reminders
router.post('/create', (req, res, next) => {
  const { name, phoneNumber, notification, timeZone, time } = req.body;
  console.log(`Helllll  pppppp ${time}`);

  

  Reminder.create({ name, phoneNumber, notification, timeZone, time }) 
  // Reminder.save()
  .then((reminder) => {
      console.log(reminder);
      res.render('users/user-home', {reminder});
    });
  
});
module.exports = router;
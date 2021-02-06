const express = require('express');
const router = express.Router();
const Reminder = require("../models/Reminder.model");

// const momentTimeZone = require('moment-timezone');
// const moment = require('moment');
// const twilio = require('twilio');
// var cron = require('node-cron');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const schedule = require('node-schedule-tz');


// const getTimeZones = () => {
//   return momentTimeZone.tz.names();
// };


// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });


// GET: /reminders
router.get('/reminders', (req, res, next) => {

  if (!req.session.user){
    res.redirect("/login");
    return;
  }

  Reminder.find({ email })
  .then((reminders) => {
      res.render('users/user-home', {reminders: reminders});
    });
});

// GET: /reminders/create
router.get('/create', (req, res, next) => {
  res.render('reminders/create', {
    // timeZones: getTimeZones(),
    reminder: new Reminder({name: '',
                                  phoneNumber: '',
                                  notification: '',
                                  timeZone: '',
                                  date: ''})});
// next(console.log(`llllllllllllllllllllll${getTimeZones()}`));
});


// POST: /reminders
router.post('/create', (req, res, next) => {
  const { name, phoneNumber, notification, timeZone, date } = req.body;
  req.body.status = false;

  // console.log(`Helllll  pppppp ${time}`);
  Reminder.create({ name, phoneNumber, notification, timeZone, date }) 
  // Reminder.save()
  .then((reminder) => {
      console.log(reminder);

    // console.log("DBDate: " + typeof reminder.date);
    // var DBDate = reminder.date;
    

    // DBDate = JSON.stringify(DBDate);
    // console.log(`Already stringified ${DBDate}`);

    // var DBDateSplit = DBDate.split("T");
    
    // var d = new Date(DBDateSplit[0] + " 00:00:00 EST");
    // // console.log(`this is d: of new date ${d}`);
    // var dYear = d.getFullYear();
    // var dMonth = d.getMonth();
    // var dDay = d.getDate();
    // var hourTime = DBDateSplit[1];
    // // console.log(`this is hourTime: ${hourTime}`);

    // var hourArray = hourTime.split(":");
    // var date = new Date(dYear, dMonth, dDay, hourArray[0], hourArray[1], 0,);
    // // console.log(`this is date ${date}`);
      res.render('users/user-home', {reminder});
    })
    .catch((err) => console.log(`error while sending message after function ${err}`));
});

router.get('/sendMessage', (req, res, next) => {
const currentDate = new Date();
const futureDate = new Date(currentDate.getTime() + (5 * 60000));

console.log(`the date range is ${currentDate.toISOString()} to --- ${futureDate.toISOString()}`);

  Reminder.find({ //query today up to tonight
    date: {
        $gte: currentDate.toISOString(), 
        $lt: futureDate.toISOString()
    }
}) 
  // Reminder.save()
  .then((reminders) => {

    if (!reminders.length) {
      console.log(`no reminders with this time query`);
      
      return;
    } else {
    reminders.forEach((reminder) => {
      console.log(`this one needs message ${reminder}`);
  

    client.messages
      .create({
          body: `Just a friendly reminder that your payment for ${reminder.name} is coming up on ${reminder.date}`,
          to: `+1${reminder.phoneNumber}`,
          from: process.env.TWIL_NUM
        })
      .then(message => {
      console.log(message.sid);
      res.json({message: 'successful, message sent'});
    })
  
      .catch((err) => console.log(`error while sending message ${err}`));

    // });
    });


  //   console.log("DBDate: " + typeof reminder.date);
  //   var DBDate = reminder.date;
    

  //   DBDate = JSON.stringify(DBDate);
  //   console.log(`Already stringified ${DBDate}`);

  //   var DBDateSplit = DBDate.split("T");
    
  //   var d = new Date(DBDateSplit[0] + " 00:00:00 EST");
  //   // console.log(`this is d: of new date ${d}`);
  //   var dYear = d.getFullYear();
  //   var dMonth = d.getMonth();
  //   var dDay = d.getDate();
  //   var hourTime = DBDateSplit[1];
  //   // console.log(`this is hourTime: ${hourTime}`);

  //   var hourArray = hourTime.split(":");
  //   var date = new Date(dYear, dMonth, dDay, hourArray[0], hourArray[1], 0,);
  // // const { date } = req.params;
  // schedule.scheduleJob('toTest', date, 'US/Eastern',  function(){

  //   client.messages
  //     .create({
  //         body: `Just a friendly reminder that your payment for ${reminder.name} is coming up on ${reminder.date}`,
  //         to: process.env.CELL_PHONE,
  //         from: process.env.TWIL_NUM
  //       })
  //     .then(message => {
  //     console.log(message.sid);
  //     res.json({message: 'successful, message sent'});
  //   })
  
  //     .catch((err) => console.log(`error while sending message ${err}`));

  //   });
  }
  });
});
module.exports = router;
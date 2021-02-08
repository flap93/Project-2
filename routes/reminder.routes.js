const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder.model");
const UserModel = require("../models/User.model");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// ********************************************************************************
// ************************ GET: /userHome ****************************************
// ********************************************************************************

router.get("/userHome", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
    return;
  }

  UserModel.findById(req.session.currentUser._id)
    .populate("reminders")
    .then((userFromDB) => {
      // console.log({userFromDB: userFromDB.reminders[0]});
      res.render("users/user-home", { reminders: userFromDB.reminders });
    });
});

// ********************************************************************************
// ************************ GET: /create ******************************************
// ********************************************************************************
router.get("/create", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
  }
  res.render("reminders/create.hbs");
});

// ********************************************************************************
// ************************ POST: /create *****************************************
// ********************************************************************************
router.post("/create", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
  }
  const { name, phoneNumber, date } = req.body;
  req.body.status = false;

  Reminder.create({ name, phoneNumber, date })
    // Reminder.save()
    .then((reminder) => {
      console.log(reminder);
      UserModel.findById(req.session.currentUser._id)
        .then((userFromDB) => {
          // router.get('/deleteReminder/:reminderIdToDelete')
          userFromDB.reminders.push(reminder._id); // userFromDB.reminders.filter(reminderId => reminderId !== req.params.reminderIdToDelete)
          userFromDB
            .save()
            .then((updatedUser) => {
              req.session.currentUser = updatedUser;
              res.redirect("/userHome");
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    })
    .catch((err) =>
      console.log(`error while sending message after function ${err}`)
    );
});

router.get("/sendMessage", (req, res, next) => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + 5 * 60000);

  console.log(
    `the date range is ${currentDate.toISOString()} to --- ${futureDate.toISOString()}`
  );

  Reminder.find({
    //query today up to tonight
    date: {
      $gte: currentDate.toISOString(),
      $lt: futureDate.toISOString(),
    },
  }).then((reminders) => {
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
            from: process.env.TWIL_NUM,
          })
          .then((message) => {
            console.log(message.sid);
            res.json({ message: "successful, message sent" });
          })

          .catch((err) => console.log(`error while sending message ${err}`));
      });
    }
  });
});

// ********************************************************************************
// ************************ GET: /deleteReminder **********************************
// ********************************************************************************

router.get("/deleteReminder/:reminderIdToDelete", (req, res, next) => {
  // const idToRemove = req.params.reminderIdToDelete;
  UserModel.findById(req.session.currentUser._id).then((userFromDB) => {
    console.log(req.session.currentUser._id);
    for (let index = 0; index < userFromDB.reminders.length; index++) {
      if (userFromDB.reminders[index] == req.params.reminderIdToDelete) {
        userFromDB.reminders.splice(index, 1);
      }
    }
    Reminder.findByIdAndRemove(req.params.reminderIdToDelete)
    .then(async () => {
        await userFromDB.save();
        res.redirect("/userHome");
      })
      .catch((err) => console.log(`error while deleting reminder ${err}`));
  });
  // router.get('/deleteReminder/:reminderIdToDelete')
  // userFromDB.reminders.filter(reminderId => reminderId !== req.params.reminderIdToDelete)
});

module.exports = router;

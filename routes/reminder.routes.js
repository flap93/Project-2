const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder.model");
const UserModel = require("../models/User.model");
const Bill = require("../models/Bill.model");

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
router.get("/create/:billId", (req, res, next) => {
  // console.log('does it work?')
  const { billId } = req.params;
  if (!req.session.currentUser) {
    res.redirect("/login");
  }
  res.render("reminders/create.hbs", { billId });
});

// ********************************************************************************
// ************************ POST: /create *****************************************
// ********************************************************************************
router.post("/create/:billId", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
  }
  const { name, phoneNumber, reminderDate, paymentDue } = req.body;
  req.body.status = false;

  Reminder.create({ name, phoneNumber, reminderDate, paymentDue, ownerName: req.session.currentUser.username })
    // Reminder.save()
    .then((reminder) => {
      console.log(reminder);
      Bill.findById(req.params.billId)
        .then((billFromDB) => {
          // router.get('/deleteReminder/:reminderIdToDelete')
          billFromDB.reminders.push(reminder._id); // userFromDB.reminders.filter(reminderId => reminderId !== req.params.reminderIdToDelete)
          billFromDB
            .save()
            .then(() => {
              res.redirect("/billHome");
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
    reminderDate: {
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
        console.log(`user in session ----`, req.session);
        client.messages
          .create({
            body: `Hey ${reminder.ownerName}! Your payment for ${reminder.name} is coming up on ${reminder.paymentDue}`,
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
  if (!req.session.currentUser) {
    res.redirect("/login");
    return;
  }
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
});

// ********************************************************************************
// ************************ GET: /editReminder **********************************
// ********************************************************************************
router.get("/editReminder/:reminderId", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
    return;
  }
  UserModel.findById(req.session.currentUser._id)
    .populate("reminder")
    .then((foundUser) => {
      // console.log("found reminder: ", foundReminder);

      // we need to filter all the users who are not the one that is currently in the found reminder
      Reminder.findById(req.params.reminderId)
      .then((reminder) => {
        
        res.render("reminders/reminder-edit.hbs", { foundUser, reminder });
      });

    }).catch((err) => console.log(`Error while getting the reminder from DB for editing: ${err}`));
});



// ********************************************************************************
// ************************ POST: /updateReminder **********************************
// ********************************************************************************
router.post("/updateReminder/:reminderId", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
    return;
  }
  const { name, phoneNumber, reminderDate, paymentDate, paymentDue} = req.body;

  Reminder.findByIdAndUpdate(req.params.reminderId, { name, phoneNumber, reminderDate, paymentDue }, { new: true })
    .then(() => {
      // console.log("updated:", updatedReminder);
     

      res.redirect(`/userHome`);
    })
    .catch((err) => console.log(`Error while saving the updates on a specific reminder: ${err}`));
});

module.exports = router;

const express = require("express");
const { update } = require("../models/Bill.model");
const router = express.Router();
const Bill = require("../models/Bill.model");
const UserModel = require("../models/User.model");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);

// ********************************************************************************
// ************************ GET: /userHome ****************************************
// ********************************************************************************

router.get("/billHome", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
    return;
  }

  UserModel.findById(req.session.currentUser._id)
  
    .populate("bills")
    .then((userFromDB) => {
      console.log(userFromDB);
      // console.log({userFromDB: userFromDB.bills});
      res.render("bills/bill-home", { bills: userFromDB.bills });
    });
});

// ********************************************************************************
// ************************ GET: /create ******************************************
// ********************************************************************************
router.get("/createBill", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
  }
  res.render("bills/createBill.hbs");
});

// ********************************************************************************
// ************************ POST: /create *****************************************
// ********************************************************************************
router.post("/createBill", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
  }
  const { accountName, paymentDue, reminder} = req.body;
  // req.body.status = false;

  Bill.create({ accountName, paymentDue, reminder, ownerName: req.session.currentUser.username })
        .then((bill) => {
            console.log(bill);
            if(bill.reminder === true){
              UserModel.findById(req.session.currentUser._id)
              .then((userFromDB) => {
                // router.get('/deleteReminder/:reminderIdToDelete')
                userFromDB.bills.push(bill._id); // userFromDB.reminders.filter(reminderId => reminderId !== req.params.reminderIdToDelete)
                userFromDB
                  .save()
                  .then((updatedUser) => {
                    req.session.currentUser = updatedUser;
                    // res.render("reminders/create.hbs", {billId : bill._id});
                    res.redirect(`/create/${bill._id}`);
                    
                  }).catch((error) => next(error));
              }).catch((error) => next(error));
            } else {
              UserModel.findById(req.session.currentUser._id)
              .then((userFromDB) => {
                // router.get('/deleteReminder/:reminderIdToDelete')
                userFromDB.bills.push(bill._id); // userFromDB.reminders.filter(reminderId => reminderId !== req.params.reminderIdToDelete)
                userFromDB
                  .save()
                  .then((updatedUser) => {
                    req.session.currentUser = updatedUser;
                    res.redirect("/billHome");
                    
                  }).catch((error) => next(error));
              }).catch((error) => next(error));
            }
            
          }).catch((err) =>
            console.log(`error while creating bill after function ${err}`)
          );
});

module.exports = router;
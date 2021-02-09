// routes/auth.routes.js
const mongoose = require('mongoose');
const User = require('../models/User.model');

const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const routeGuard = require("../configs/route-guard.config");

////////////////////////////////////////
////////// SIGNUP //////////////////////
////////////////////////////////////////

// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
  console.log('The form data: ', req.body);
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      // console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword
      
    });
    }) 
    .then((responseFromDB) => {
      console.log('Newly created user is: ', {responseFromDB});
      req.session.currentUser = responseFromDB;
      res.redirect('/userHome');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }  
  });
});

//router.get('/userProfile', (req, res) => res.render('users/user-profile', { userInSession: req.session.currentUser }));

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////LOGIN/////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs');
});

router.post('/login', (req, res, next) => {
  // console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({ email })
    .then((responseFromDB) => {
      if (!responseFromDB) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, responseFromDB.passwordHash)) {
        // res.render('users/user-profile', { user });
        req.session.currentUser = responseFromDB;
        //console.log(user);
        //res.render('users/user-profile.hbs', {user: responseFromDB} );
        res.redirect('/userHome');

      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});



router.get('/userProfile', routeGuard, (req, res, next) => {
  res.render("users/user-profile.hbs");

});

////////////////////////////////////////
////////// LOGOUT //////////////////////
////////////////////////////////////////

router.post("/logout", (req, res, next) => {
  // console.log("user in sess before: ", req.session.currentUser);
  req.session.destroy();
  // console.log("user in sess after: ", req.session);

  res.redirect("/");
});

module.exports = router;




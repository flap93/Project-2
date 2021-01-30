const express = require('express');
const router = express.Router();

/* GET  user home page */
router.get('/userHome', (req, res) => res.render('users/user-home', { title:'hello this is a test' }));

//Get new bill page
router.get('/newBill', (req, res) => res.render('users/new-bill', { title:'this is where the form for the new bill is going to be ' }));






module.exports = router;

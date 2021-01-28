
const express = require('express');
const router = express.Router();
const Author = require('../models/Author.model.js');



/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

module.exports = router;




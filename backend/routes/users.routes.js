var express = require('express');
var router = express.Router();
const userController = require('../models/user.model');
const auth = require("../middlewares/auth");

/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

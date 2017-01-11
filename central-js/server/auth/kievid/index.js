'use strict';

var express = require('express');
var router = express.Router();
router.get("/", require('./kievid.service').callback)

module.exports = router;

var express = require('express');
var router = express.Router();
var form = require('./form.controller');

router.post('/', form.submit);
router.get('/', form.get);
router.post('/scan', form.uploadScan);

module.exports = router;
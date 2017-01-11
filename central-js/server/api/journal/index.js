var express = require('express');
var router = express.Router();
var journal = require('./journal.controller');
var auth = require('../../auth/auth.service.js');
router.use(auth.setCORS);
router.get('/', auth.isAuthenticated(), journal.getHistoryEvents);
router.get('/cors', journal.getHistoryEvents);
router.post('/', auth.isAuthenticated(), journal.setHistoryEvent);
router.get('/:nID_HistoryEvent_Service', auth.isAuthenticated(), journal.getHistoryEvents);

module.exports = router;

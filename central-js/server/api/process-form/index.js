var express = require('express')
  , router = express.Router()
  , form = require('./form.controller')
  , auth = require('../../auth/auth.service.js')
  , region = require('../../components/region')
  , endpoint = require('../../components/endpoint');

router.get('/', endpoint.assertQueryParams('nID_Server', 'sID_BP_Versioned'), form.index);
router.post('/', endpoint.assertQueryParams('nID_Server'), form.submit);
router.get('/sign', endpoint.assertQueryParams('nID_Server'), form.signForm);
router.use('/sign/callback', endpoint.assertQueryParams('nID_Server'), form.signFormCallback);
router.get('/sign/check', endpoint.assertQueryParams('nID_Server'), form.signCheck);
router.post('/save', endpoint.assertQueryParams('nID_Server'), form.saveForm);
router.get('/load', endpoint.assertQueryParams('nID_Server'), form.loadForm);
router.post('/scansUpload', endpoint.assertQueryParams('nID_Server'), form.scanUpload);

module.exports = router;

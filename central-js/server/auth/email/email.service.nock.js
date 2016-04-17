'use strict';

var appTest = require('../../api/app.spec.js');

var headers = {
  'content-type': 'application/json;charset=UTF-8'
};

appTest
  .centralNock
  .get('/wf/service/access/verifyContactEmail')
  .query(true)
  .reply(200, {
    bVerified: true
  }, headers);

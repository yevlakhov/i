'use strict';

var centralMock = require('../../api/api.central.nock.js').centralMock;

var headers = {
  'content-type': 'application/json;charset=UTF-8'
};

centralMock
  .get('/wf/service/access/verifyContactEmail')
  .query(true)
  .reply(200, {
    bVerified: true
  }, headers);

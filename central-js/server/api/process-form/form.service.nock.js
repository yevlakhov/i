'use strict';

var regionMock = require('../api.region.nock').regionMock
  , formServiceTest = require('./form.service.test');

var headers = {
  'content-type': 'application/json;charset=UTF-8'
};

regionMock
  .get('/wf/service/form/form-data')
  .query(true)
  .reply(200, formServiceTest.testData.forms.empty, headers);

regionMock
  .post('/wf/service/form/form-data')
  .query(true)
  .reply(200, formServiceTest.testData.forms.empty, headers);


'use strict';

var centralMock = require('../api.central.nock').centralMock
  , subjectServiceTest = require('./subject.service.test.js');

var headers = {
  'content-type': 'application/json;charset=UTF-8'
};

centralMock
  .get('/wf/service/subject/syncSubject')
  .query(true)
  .reply(200, subjectServiceTest.testData.subject, headers);

centralMock
  .get('/wf/service/subject/getSubjectOrgan')
  .query(true)
  .reply(200, subjectServiceTest.testData.subjectOrgan, headers);

centralMock
  .get('/wf/service/subject/getSubjectHuman')
  .query(true)
  .reply(200, subjectServiceTest.testData.subjectHuman, headers);

centralMock
  .get('/wf/service/subject/getServer')
  .query(true)
  .reply(200, subjectServiceTest.testData.sHost, headers);

'use strict';

var nock = require('nock')
  , appData = require('./app.data.spec');

var headersJSON = {
  'Content-Type': 'application/json;charset=UTF-8'
};

var regionMock = nock('https://test.region.igov.org.ua')
  .persist()
  .log(console.log)
  .get('/wf/service/object/file/check_file_from_redis_sign')
  .query({sID_File_Redis: 1, nID_Subject: 11})
  .reply(200, appData.signCheck, headersJSON)
  .get('/wf/service/object/file/check_file_from_redis_sign')
  .query({sID_File_Redis: 2, nID_Subject: 11})
  .reply(200, appData.signCheckError, headersJSON);

module.exports.regionMock = regionMock;

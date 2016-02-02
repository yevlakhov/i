'use strict';

var nock = require('nock');
var url = require('url');
var urlencode = require('urlencode');
var superagent = require('superagent');
var supertest = require('supertest-as-promised');
var app = require('./app');
var appData = require('./app.data.spec.js');
var config = require('./config/environment');
var soccardUtil = require('./auth/soccard/soccard.util.js');
var bankidUtil = require('./auth/bankid/bankid.util.js');
var testRequest = supertest(app);
var loginAgent = superagent.agent();


var pathFromURL = function (urlString) {
  return urlString.split(/\?/).filter(function (item, i) {
    return i == 0
  }).reduce(function (previous, item) {
    return item
  })
};
var queryStringToObject = function (urlString) {
  return urlString.split(/&|\?/g)
    .filter(function (item, i) {
      return i > 0
    }).reduce(function (toObject, item) {
      var pair = item.split(/=/);
      toObject[pair[0]] = pair[1];
      return toObject;
    }, {});
};

var baseUrlsBankId = bankidUtil.getBaseURLs();

var testAuthResultPath = '/auth/result';
var testAuthResultBase = 'http://localhost:9001';
var testAuthResultURL = testAuthResultBase + testAuthResultPath;

var authResultMock = nock(testAuthResultBase)
  .persist()
  .log(console.log)
  .get(testAuthResultPath)
  .query(true)
  .reply(200, function (uri, requestBody) {
    var query = queryStringToObject(uri);
    for (var key in query) {
      query[key] = urlencode.decode(query[key]);
    }
    return query;
  }, {
    'content-type': 'application/json;charset=UTF-8'
  });


function getHeaders() {
  return {
    'content-type': 'application/json;charset=UTF-8',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'Authorization, content-type',
    'access-control-allow-methods': 'GET, OPTIONS, POST',
    'access-control-allow-credentials': 'true'
  };
}

function getRedirectURL(req, code) {
  var query = queryStringToObject(req.path);
  var redirect = urlencode.decode(query.redirect_uri);
  var baseURL = pathFromURL(redirect);
  var redirectQuery = queryStringToObject(redirect);
  var result = baseURL + '?link=' + urlencode.encode(redirectQuery.link) + (code ? '&code=' + code : '');
  var path = url.parse(result).path;
  return 'http://localhost:9000' + path;
}

var baseUrlsSoccard = soccardUtil.getBaseURLs();
var soccardMock = nock(baseUrlsSoccard.access.base)
  .persist()
  .log(console.log)
  .get(baseUrlsSoccard.access.path.auth)
  .query(true)
  .reply(302, {}, {
    'Location': function (req) {
      return getRedirectURL(req);
    }
  })
  .post(baseUrlsSoccard.access.path.token)
  .query(true)
  .reply(200, appData.token, getHeaders())
  .post(baseUrlsSoccard.resource.path.info)
  .reply(200, appData.ccoUser, getHeaders());

var bankidMock = nock(baseUrlsBankId.access.base)
  .persist()
  .log(console.log)
  .get(baseUrlsBankId.access.path.auth)
  .query(true)
  .reply(302, {}, {
    'Location': function (req) {
      return getRedirectURL(req, 112233);
    }
  })
  .post(baseUrlsBankId.access.path.token)
  .query(true)
  .reply(200, appData.token, getHeaders())
  .post(baseUrlsBankId.resource.path.info)
  .reply(200, {
    "state": "ok",
    "customer": appData.customer
  }, getHeaders());

var centralNock = nock('https://test.igov.org.ua')
  .persist()
  .log(console.log)
  .get('/wf/service/subject/syncSubject')
  .query(true)
  .reply(200, appData.syncedCustomer, {
    'content-type': 'application/json;charset=UTF-8'
  });

var regionMock = nock('http://test.region.service')
  .persist()
  .log(console.log)
  .get('/service/object/file/check_file_from_redis_sign')
  .query({sID_File_Redis: 1, nID_Subject: 20049})
  .reply(200, appData.signCheck, {
    'Content-Type': 'application/json'
  })
  .get('/service/object/file/check_file_from_redis_sign')
  .query({sID_File_Redis: 2, nID_Subject: 20049})
  .reply(200, appData.signCheckError, {
    'Content-Type': 'application/json'
  });


module.exports.loginWithBankID = function (callback) {
  testRequest
    .get('/auth/bankid/callback?code=11223344&?link=' + testAuthResultURL)
    .expect(302)
    .then(function (res) {
      loginAgent.saveCookies(res);
      callback(null, loginAgent);
    }).catch(function (err) {
    callback(err)
  });
};

module.exports.loginWithEds = function (callback) {
  testRequest
    .get('/auth/eds/callback?code=11223344&?link=' + testAuthResultURL)
    .expect(302)
    .then(function (res) {
      loginAgent.saveCookies(res);
      callback(null, loginAgent);
    }).catch(function (err) {
    callback(err)
  });
};

module.exports.loginWithSoccard = function (callback) {
  testRequest
    .get('/auth/soccard/callback?code=11223344&link=' + testAuthResultURL)
    .expect(302)
    .then(function (res) {
      loginAgent.saveCookies(res);
      callback(null, loginAgent);
    }).catch(function (err) {
    callback(err)
  });
};

module.exports.app = app;
module.exports.bankidMock = bankidMock;
module.exports.soccardMock = soccardMock;
module.exports.centralNock = centralNock;
module.exports.regionMock = regionMock;
module.exports.authResultMock = authResultMock;
module.exports.testRequest = testRequest;

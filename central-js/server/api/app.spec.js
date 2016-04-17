'use strict';

var nock = require('nock')
  , url = require('url')
  , urlencode = require('urlencode')
  , superagent = require('superagent')
  , supertest = require('supertest-as-promised')
  , async = require('async')
  , app = require('./../app')
  , config = require('./../config/environment/index')
  , testRequest = supertest(app)
  , appTests = require('./app.tests.spec.js')(testRequest);

require('./api.region.nock.js');
require('./api.central.nock');
require('./uploadfile/uploadfile.service.nock');
require('./../auth/bankid/bankid.service.nock');


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

var headersJSON = {
  'Content-Type': 'application/json;charset=UTF-8'
};

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
  }, headersJSON);

function getAuth(urlWithQueryParams, agentCallback, done) {
  testRequest
    .get(urlWithQueryParams)
    .expect(302)
    .then(function (res) {
      var loginAgent = superagent.agent();
      loginAgent.saveCookies(res);
      if (agentCallback) {
        agentCallback(loginAgent);
      }
      done();
    }).catch(function (err) {
    done(err)
  });
}

module.exports.loginWithBankID = function (done, agentCallback) {
  getAuth('/auth/bankid/callback?code=11223344&?link=' + testAuthResultURL, agentCallback, done);
};

module.exports.loginWithEds = function (done, agentCallback) {
  getAuth('/auth/eds/callback?code=11223344&link=' + testAuthResultURL, agentCallback, done);
};

module.exports.loginWithEmail = function (callback) {
  var code = 'ssss111';
  var email = 'test@test.com';
  var link = testAuthResultURL;
  var firstName = 'firstName';
  var lastName = 'lastName';
  var middleName = 'middleName';

  function prepareGet(url, agent) {
    var r = testRequest.get(url);
    if (agent) {
      agent.attachCookies(r);
    }
    return r;
  }

  function preparePost(url, agent) {
    var r = testRequest.post(url);
    if (agent) {
      agent.attachCookies(r);
    }
    return r;
  }

  function doGet(request, asyncCallback) {
    request
      .expect(302)
      .then(function (res) {
        loginAgent.saveCookies(res);
        asyncCallback(null, loginAgent);
      })
      .catch(function (err) {
        asyncCallback(err, null);
      });
  }

  function doPost(request, body, asyncCallback) {
    request
      .send(body)
      .expect(200)
      .then(function (res) {
        var loginAgent = superagent.agent();
        loginAgent.saveCookies(res);
        asyncCallback(null, loginAgent);
      })
      .catch(function (err) {
        asyncCallback(err, null);
      });
  }

  async.waterfall([
    function (asyncCallback) {
      doPost(preparePost('/auth/email/verifyContactEmail'), {email: email, link: link}, asyncCallback);
    },
    function (agent, asyncCallback) {
      doPost(preparePost('/auth/email/verifyContactEmailAndCode', agent), {email: email, code: code}, asyncCallback);
    },
    function (agent, asyncCallback) {
      doPost(preparePost('/auth/email/editFio', agent), {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName
      }, asyncCallback);
    },
    function (agent, asyncCallback) {
      doGet(prepareGet('/auth/email', agent), asyncCallback);
    }
  ], function (error, result) {
    callback(error, result);
  });
};


module.exports.app = app;
module.exports.authResultMock = authResultMock;
module.exports.testRequest = testRequest;
module.exports.tests = appTests;

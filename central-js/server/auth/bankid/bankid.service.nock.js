var nock = require('nock')
  , url = require('url')
  , urlencode = require('urlencode')
  , appData = require('../../api/app.data.spec.js')
  , config = require('../../config/environment/index')
  , bankidUtil = require('./bankid.util.js');

var headersJSON = {
  'Content-Type': 'application/json;charset=UTF-8'
};

var baseUrls = bankidUtil.getBaseURLs();

var bankidMock = nock(baseUrls.access.base)
  .persist()
  .log(console.log)
  .get(baseUrls.access.path.auth)
  .query(true)
  .reply(302, {}, {
    'Location': function (req) {
      var query = queryStringToObject(req.path);
      var redirect = urlencode.decode(query.redirect_uri);
      var baseURL = pathFromURL(redirect);
      var redirectQuery = queryStringToObject(redirect);
      var result = baseURL + '?link=' + urlencode.encode(redirectQuery.link) + '&code=112233';
      var path = url.parse(result).path;
      return 'http://localhost:9000' + path;
    }
  })
  .post(baseUrls.access.path.token)
  .query(true)
  .reply(200, appData.token, headersJSON)
  .post(baseUrls.resource.path.info)
  .reply(200, {
    "state": "ok",
    "customer": appData.customer
  }, headersJSON);

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

module.exports.bankidMock = bankidMock;

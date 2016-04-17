'use strict';

var nock = require('nock');

var centralMock = nock('https://test.igov.org.ua')
  .persist()
  .log(console.log);

module.exports.centralMock = centralMock;

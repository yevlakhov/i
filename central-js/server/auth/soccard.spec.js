'use strict';

var should = require('should');
var appTest = require('../app.spec');

describe('test soccard callback', function () {
  it('should create cookie session', function (done) {
    appTest.loginWithSoccard(function (error) {
      if (error) {
        done(error)
      } else {
        done();
      }
    });
  });
});

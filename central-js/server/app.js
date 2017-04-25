/**
 * Main application file
 */

'use strict';

var express = require('express');
var config = require('./config/environment');
//var config = require('./config');

// var nock = require('nock');
//
// nock.recorder.rec();
// Setup server
var app = express();

require('./config/server')(app);
require('./config/express')(app);
require('./routes')(app);


//TODO cache fixes
var addr;
const EventEmitter = require('events');
const myEE = new EventEmitter();
myEE.on('addrCreated', sendRequest);
var request = require('request');
var inter = setInterval(function () {
  if (app.get('address') != undefined) {
    addr = app.get('address');
    myEE.emit('addrCreated')
    clearInterval(inter)
  }
}, 1000);

setInterval(function () {
  var date = new Date();
  if(date.getHours()==4)sendRequest()
},1000*60*60)

function sendRequest() {
  var serverAddr = config.server.protocol + "://" + (addr.address == "::" ? "localhost" : addr.address) + (addr.port?":"+ addr.port:'');
  console.time('get catalog');
  console.log(serverAddr);
  request(serverAddr + '/api/catalog?asIDPlaceUA=8000000000,8000000000&bShowEmptyFolders=false', {json: true}, function (err, resp, body) {
    console.timeEnd('get catalog')
    if(err!=null)return sendRequest();
    var counter =0;
    body.forEach(function (category) {
      if (category.aSubcategory)
        category.aSubcategory.forEach(function (subcategory) {
          if (subcategory.aService)
            subcategory.aService.forEach(function (service) {
              counter++;
              setTimeout(function () {
                request(serverAddr + '/api/service?nID=' + service.nID, {json: true})
              },counter*500)
            })
        })
    })
  })
  request(serverAddr + '/api/catalog?bShowEmptyFolders=false', {json: true});
}

// Expose app
module.exports = app;

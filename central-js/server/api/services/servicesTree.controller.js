'use strict';

var request = require('request');
var config = require('../../config/environment');
var activiti = config.activiti;

var buildUrl = function(path){
  var url = activiti.protocol + '://' + activiti.hostname + activiti.path + path;
  return url;
};

module.exports.getServicesTree = function (req, res) {

  var options = {
    protocol: activiti.protocol,
    hostname: activiti.hostname,
    port: activiti.port,
    path: activiti.path,
    username: activiti.username,
    password: activiti.password,
    params: {
      sFind: req.query.sFind || null,
      asIDPlaceUA: req.query.asIDPlaceUA || null
    }
  };

  var callback = function (error, response, body) {
    res.send(body);
    res.end();
  };

  var url = activiti.protocol + '://' + activiti.hostname + activiti.path + '/services/getServicesTree';

  return request.get({
    'url': url,
    'auth': {
      'username': options.username,
      'password': options.password
    },
    'qs': {
      'sFind': options.params.sFind,
      'asID_Place_UA': options.params.asIDPlaceUA
    }
  }, callback);
};

module.exports.setServicesTree = function(req, res) {
  var options = {
    path: 'services/setServicesTree',
    query: {
      nID_Subject : req.query.nID_Subject
    }
  };

  activiti.sendPostRequest(req, res, '/flow/setFlowSlot_ServiceData', {
    nID_FlowSlot: req.params.nID
  }, null, sHost);

  activiti.post(options, function(error, statusCode, result) {
    res.statusCode = statusCode;
    res.send(result);
  }, req.body);
};

var remove = function(path, req, res){
  var options = {
    path: path,
    query: {
      nID: req.query.nID,
      bRecursive: req.query.bRecursive,
      nID_Subject: req.query.nID_Subject
    }
  };

  activiti.del(options, function(error, statusCode, result) {
    if (error) {
      res.send(error);
    } else {
      res.status(statusCode).json(result);
    }
  });
};

module.exports.removeService = function(req, res) {
  return remove('services/removeService', req, res);
};

module.exports.removeServiceData = function(req, res) {
  return remove('services/removeServiceData', req, res);
};

module.exports.removeSubcategory = function(req, res) {
  return remove('services/removeSubcategory', req, res);
};

module.exports.removeCategory = function(req, res) {
  return remove('services/removeCategory', req, res);
};

module.exports.removeServicesTree = function(req, res) {
  var options = {
    path: 'services/removeServicesTree',
    query: {
      nID_Subject: req.query.nID_Subject
    }
  };

  activiti.del(options, function(error, statusCode, result) {
    if (error) {
      res.send(error);
    } else {
      res.status(statusCode).json(result);
    }
  });
};


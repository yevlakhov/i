'use strict';

var express = require('express');
var passport = require('passport');
var request = require('request');
var authService = require('../auth.service');
var syncSubject = require('../../api/subject/subject.service');

module.exports.callback = (req, res, next)=> {
  let code = req.query.code,
    state = req.query.state;
  let clientIDRed;
  let hostnameAuth;
  if (req.headers.host.search('localhost') != -1) {
    clientIDRed = 8443;
    hostnameAuth = 'id.kitsoft.kiev.ua';
  }else if (req.headers.host.search('central.es') != -1) {
    clientIDRed = 8933;
    hostnameAuth = 'id.kyivcity.gov.ua';
  }else if (req.headers.host.search('test3.es') != -1) {
    clientIDRed = 8922;
    hostnameAuth = 'id.kyivcity.gov.ua';
  }else if (req.headers.host == "poslugy.kyivcity.gov.ua") {
    clientIDRed = 8911;
    // hostnameAuth = 'id.kitsoft.kiev.ua';
    hostnameAuth = 'id.kyivcity.gov.ua';
  }else{
    clientIDRed = 8443;
    hostnameAuth = 'id.kyivcity.gov.ua';
  }
  var getToken = ()=> {
    return new Promise((resolve, reject)=> {
      request.post(`https://${hostnameAuth}/oauth/token`, {
        form: {
          code,
          client_id: clientIDRed,
          client_secret: clientIDRed,
          grant_type: 'authorization_code'
        }, json: true
      }, (err, resp, body)=> {
        if(err!=null)return res.redirect(decodeURIComponent(state || "/"));
        //TODO доделать отправку токена на получение пользователя
        resolve(body)
      })
    })
  };

  var getUserId = (body)=> {
    return new Promise((resolve, reject)=> {
      request(`https://${hostnameAuth}/user/info?access_token=${body.access_token}`, {json: true}, (error, response, data)=> {
        console.log(data);
        if (data == undefined) {
          return res.status(400).redirect(decodeURIComponent(state || "/"));
        }
        resolve({user: data, access: body})
      })
    })
  }

  var getMyUser = (body)=> {
    var inn = undefined;
    if (body.user.services) {
      for (let key in body.user.services) {
        if (typeof inn == 'undefined' && (!!body.user.services[key].inn != false || !!body.user.services[key].edrpoucode != false || !!body.user.services[key].drfocode != false))
          inn = body.user.services[key].inn || body.user.services[key].edrpoucode || body.user.services[key].drfocode;
      }
    }


    if (inn == undefined) {
      return res.status(400).redirect(decodeURIComponent(state || "/"));
    }


    syncSubject.sync(inn, function (error, response, data) {
      let user = {
          customer: {
            firstName: body.user.first_name,
            middleName: body.user.middle_name != undefined ? body.user.middle_name : null,
            lastName: body.user.last_name,
          },
          subject: data
        },
        access = {
          accessToken: body.access.access_token,
          refreshToken: body.access.refresh_token
        };

      if(typeof body.user.phone!="undefined") user.customer.phone = body.user.phone;
      if(typeof body.user.birthday!="undefined") user.customer.birthDay = body.user.birthday.replace(/\//gi,".");
      if(typeof body.user.email!="undefined") user.customer.email = body.user.email;
      req.session = authService.createSessionObject('kyivid', user, access);
      delete req.session.prepare;
      res.redirect(decodeURIComponent(state || "/"));
    })
  }

  getToken().then(getUserId).then(getMyUser)

}
module.exports.convertToCanonical = function (customer) {
  // сохранение признака для отображения надписи о необходимости проверки регистрационных данных, переданых от BankID
  // console.log(customer);
  customer.isAuthTypeFromBankID = true;
  return customer;
};
module.exports.getUserKeyFromSession = function (session) {
  return session.access.accessToken;
};

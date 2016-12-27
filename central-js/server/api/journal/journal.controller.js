var request = require('request');
var syncSubject = require('../subject/subject.service');

function getOptions(req) {
    var config = require('../../config/environment');
  //var config = require('../../config');

  var activiti = config.activiti;

    return {
        protocol: activiti.protocol,
        hostname: activiti.hostname,
        port: activiti.port,
        path: activiti.path,
        username: activiti.username,
        password: activiti.password
    };
}

module.exports.getHistoryEvents = function(req, res) {

    var options = getOptions(req);
    var url = options.protocol
        + '://'
        + options.hostname
        + options.path
        + '/action/event/getHistoryEvents';

    var callback = function(error, response, body) {
        res.send(body);
        res.end();
    };
    if(!req.query.access_token){
        return request.get({
            'url': url,
            'auth': {
                'username': options.username,
                'password': options.password
            },
            'qs': {
                'nID_Subject': req.session.subject.nID,
                'nID_HistoryEvent_Service': req.params.nID_HistoryEvent_Service,
                'bGrouped': req.params.nID_HistoryEvent_Service ? false : true
            }
        }, callback);
    }else{
        var getUserId = ()=> {
            return new Promise((resolve, reject)=> {
                request(`https://accounts.kitsoft.kiev.ua/user/info?access_token=${req.headers.access_token}`, {json: true}, (error, response, data)=> {
                    resolve(data)
                })
            })
        }

        var getMyUser = (body)=> {
            return new Promise((resolve,reject)=>{
                syncSubject.sync('3119325858', function (error, response, data) {
                    resolve(data)
                })
            })
        }

        var getHistory = (data)=>{
            return request.get({
                'url': url,
                'auth': {
                    'username': options.username,
                    'password': options.password
                },
                'qs': {
                    'nID_Subject': data.nID,
                    'nID_HistoryEvent_Service': req.params.nID_HistoryEvent_Service,
                    'bGrouped': req.params.nID_HistoryEvent_Service ? false : true
                }
            }, callback);
        }

        getUserId().then(getMyUser).then(getHistory)
    }

};

module.exports.setHistoryEvent = function(req, res) {

    var options = getOptions(req);
    var url = options.protocol
        + '://'
        + options.hostname
        + options.path
        + '/action/event/setHistoryEvent';

    var callback = function(error, response, body) {
        // console.log(body);
        res.send(body);
        res.end();
    };

//    oHistoryEvent:{
//        "nID": 445
//            ,"nID_Subject": 2
//            ,"nID_HistoryEventType":3
//            ,"sEventName":"" - консолидированное название события
//            ,"sMessage":""
//            ,"sDate":"2015-11-25 23:23:59.325"
//    }

    return request.post({
        'url': url,
        'auth': {
            'username': options.username,
            'password': options.password
        },
        'qs': {
            "nID": 445,
            "nID_Subject": 2,
            "nID_HistoryEventType": 3,
            "sEventName": "",
            "sMessage": "",
            "sDate": "2015-11-25 23:23:59.325"
        }
    }, callback);
};

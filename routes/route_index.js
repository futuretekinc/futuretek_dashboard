var express = require('express');
var fs = require('fs');
var snmp = require('net-snmp');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

    // 현재 모니터링 하고 있는 센서들이 있는지 여부를 확인한다.
    var monitorList="";
    fs.exists('./db/monitoring.json', function (exists) {
        if (exists) {
            // 현재 모니터링 하고 있는 센서 리스트를 가져온다.
            var readMonitoringData = fs.readFileSync('./db/monitoring.json', 'utf-8');

            // 쿼리
            if (readMonitoringData != "") {
                monitorList = JSON.parse(readMonitoringData);
                console.log(monitorList);
            }
            for (var i = 0; i < monitorList.length; i++) {
                console.log(monitorList[i].edgenodeIP);
                console.log(getOID(monitorList[i].sensor, Number(monitorList[i].sensorIndex) + 1));
            }

            res.render('index', { title: 'Dashboard', sensors: monitorList});
        } else {
            res.render('index', { title: 'Dashboard', sensors: monitorList});
        }
    });
});

function getOID(_sensorName, _index) {

    var oid;
    switch (_sensorName) {
        case 'PT100' :
            oid = '1.3.6.1.4.1.42251.1.3.2.3.2.1.6.' + _index;
            break;
        case 'DS18B20' :
            oid = '1.3.6.1.4.1.42251.1.3.2.3.2.1.6.' + _index;
            break;
        case 'SHT' :
            oid = '1.3.6.1.4.1.42251.1.3.2.4.2.1.6.' + _index;
            break;
        case 'DI' :
            oid = '' + _index;
            break;
        case 'DO' :
            oid = '' + _index;
            break;
    }
    return oid;
}
/*
var session = snmp.createSession('10.0.1.43', 'public');
var oids = ['1.3.6.1.4.1.42251.1.3.2.4.2.1.6.1'];

session.get(oids, function (error, varbinds) {
    if (error) {
        console.log(error);
    } else {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError(varbinds[i])) {
                console.error(snmp.varbindError(varbinds[i]));
            } else {
                console.log("ip : " + varbinds[i].oid + " = " + varbinds[i].value);
            }
        }
    }
});

var temperature_oids = [
    '1.3.6.1.4.1.42251.1.3.2.3.1.0',
    '1.3.6.1.4.1.42251.1.3.2.3.2.1.1',
    '1.3.6.1.4.1.42251.1.3.2.3.2.1.6'
];

var humidity_oids = [
    '1.3.6.1.4.1.42251.1.3.2.4.1.0',
    '1.3.6.1.4.1.42251.1.3.2.4.2.2.1',
    '1.3.6.1.4.1.42251.1.3.2.4.2.1.6'
];
*/
/*
var PushSensor = function () {
    var self = this;
    setInterval( function() {
        self.emit('push');
    }, 1000);
};
util.inherits(PushSensor, EventEmitter);

var pushSensor = new PushSensor();
pushSensor.on('push', function () {
    //snmp.push();
    console.log("loop");
});
*/

module.exports = router;
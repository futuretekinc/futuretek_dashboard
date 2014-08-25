var express = require('express');
var router = express.Router();
var dgram = require('dgram');
var snmp = require('net-snmp');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var async = require('async');

// setting snmp
var MyClass = function () { this.emit('getSensorData'); };
var Discovery = function () { this.emit('getIps'); };
util.inherits(MyClass, EventEmitter);
util.inherits(Discovery, EventEmitter);
var myclass = new MyClass();
var discovery = new Discovery();

var server = dgram.createSocket('udp4');
server.on('message', function (message, remote) {
    //console.log("discovery ip = " + remote.address);
    discovery.emit('getIps', remote.address);
    //myclass.emit('getSensorData', remote.address);
});
server.bind(162);

var SEND_PORT = 1234;
var SEND_HOST = '10.0.1.255';
var message = new Buffer('Hello?');

//discovery.on('getIps', function(_iplist){
//    console.log(_iplist);
//});

function getSensorValue() {
    var client = dgram.createSocket('udp4');

    client.bind(function(){
        client.setBroadcast(true);
    });

    client.send(message, 0, message.length, SEND_PORT, SEND_HOST, function () {
        client.close();
    });
}

var DEFINE_COUNT = 0,
    DEFINE_ID = 1,
    DEFINE_VALUE = 2;

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


myclass.on('getSensorData', function (_data) {

    var session = snmp.createSession(_data, 'public');
    var oids;

    async.waterfall([
        function (cb) {
            oids = [temperature_oids[DEFINE_COUNT]];
            session.get(oids, function (error, varbinds) {
                if (error) {
                    console.log(error);
                } else {
                    for (var i = 0; i < varbinds.length; i++) {
                        if (snmp.isVarbindError(varbinds[i])) {
                            console.error(snmp.varbindError(varbinds[i]));
                        } else {
                            console.log("ip : " + _data + " ======= " + varbinds[i].oid + " = " + varbinds[i].value);
                            cb(null, varbinds[i].value);
                        }
                    }
                }
            });
        },
        function (count, cb) {
            oids = [];
            if (count > 0) {
                for (var i=1; i<=count; i++) {
                    oids.push(temperature_oids[DEFINE_ID] + "." + i);
                    oids.push(temperature_oids[DEFINE_VALUE] + "." + i);
                }
            }
            //console.log(oids);

            session.get(oids, function (error, varbinds) {
                if (error) {
                    console.log(error);
                } else {
                    for (var i = 0; i < varbinds.length; i++) {
                        if (snmp.isVarbindError(varbinds[i])) {
                            console.error(snmp.varbindError(varbinds[i]));
                        } else {
                            console.log("ip2 : " + _data + " ======= " + varbinds[i].oid + " = " + varbinds[i].value);
                        }
                    }
                }
            });
        }

    ]);
});

myclass.emit('getSensorData', '10.0.1.46');

module.exports = router;
module.exports.getSensorValue = getSensorValue;
module.exports.discover = discovery;
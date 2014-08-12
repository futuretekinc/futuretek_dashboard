var express = require('express');
var router = express.Router();
var dgram = require('dgram');
var snmp = require('net-snmp');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var server = dgram.createSocket('udp4');
var client = dgram.createSocket('udp4');

server.on('message', function (message, remote) {
    console.log("descovery ip = " + remote.address);
    myclass.emit('getSensorData', remote.address);
});

server.bind(162);

var SEND_PORT = 1234;
var SEND_HOST = '10.0.1.255';
var message = new Buffer('Hello?');

client.bind(function(){
    client.setBroadcast(true);
});

client.send(message, 0, message.length, SEND_PORT, SEND_HOST, function() {
    client.close();
});

// setting snmp
var MyClass = function () { this.emit('getSensorData'); };
util.inherits(MyClass, EventEmitter);

var myclass = new MyClass();
myclass.on('getSensorData', function (_data) {

    var session = snmp.createSession(_data, 'public');
    var oids = ['1.3.6.1.4.1.42251.1.3.2.3.1.0'];

    session.get(oids, function (error, varbinds) {
        if (error) {
            console.log(error);
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i])) {
                    console.error(snmp.varbindError(varbinds[i]));
                } else {
                    console.log(varbinds[i].oid + " = " + varbinds[i].value);
                }
            }
        }
    });
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

module.exports = router;
var express = require('express');
var router = express.Router();
var dgram = require('dgram');

var server = dgram.createSocket('udp4');
var client = dgram.createSocket('udp4');

server.on('message', function (message, remote) {
    console.log("descovery ip = " + remote.address);
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

module.exports = router;
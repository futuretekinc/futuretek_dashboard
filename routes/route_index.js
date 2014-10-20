var express = require('express');
var fs = require('fs');
var snmp = require('net-snmp');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
require('date-utils');
var router = express.Router();

var DEFINE_SENSOR_TYPE_TEMPERATURE = 0,
    DEFINE_SENSOR_TYPE_HUMIDITY = 1,
    DEFINE_SENSOR_TYPE_FLOODING = 2,
    DEFINE_SENSOR_TYPE_DOOR = 3;

var headers = {
    'Content-Type':     'application/xml, text/xml'
};

function getDate() {
    var date = new Date();
    var d = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    return d;
}

// 현재 모니터링 하고 있는 센서들이 있는지 여부를 확인한다.
var monitorList = "";
function sendSensorValues() {
    fs.exists('./db/monitoring.json', function (exists) {
        if (exists) {
            // 현재 모니터링 하고 있는 센서 리스트를 가져온다.
            var readMonitoringData = fs.readFileSync('./db/monitoring.json', 'utf-8');

            // 쿼리
            if (readMonitoringData != "") {
                monitorList = JSON.parse(readMonitoringData);
                //console.log(monitorList);
            }
            for (var i = 0; i < monitorList.length; i++) {
                console.log(monitorList[i].edgenodeIP);
                console.log(getOID(monitorList[i].sensor, Number(monitorList[i].sensorIndex) + 1));

                var session = snmp.createSession(monitorList[i].edgenodeIP, 'public');
                var oids = getOID(monitorList[i].sensor, monitorList[i].sensorId.slice(7));

                session.get(oids, function (error, varbinds) {
                    if (error) {
                        console.log(error);
                    } else {
//                        for (var i = 0; i < varbinds.length; i++) {
//                            if (snmp.isVarbindError(varbinds[i])) {
//                                console.error(snmp.varbindError(varbinds[i]));
//                            } else {
//                                console.log("oid = " + varbinds[i].oid + " |||| value = " + varbinds[i].value);
//                            }
//                        }
                        //console.log(String(varbinds[1].value));
                        //console.log (String(varbinds[2].value), String(varbinds[3].value));
                        switch (String(varbinds[1].value)) {
                            case "DI" :
                                console.log("DI =============================================================");
                                createStream(varbinds[0].value, DEFINE_SENSOR_TYPE_DOOR, String(varbinds[2].value));
                                break;
//                            case "DO" :
//                                console.log("DO =============================================================");
//                                createStream(varbinds[0].value, DEFINE_SENSOR_TYPE_FLOODING, String(varbinds[2].value));
//                                break;
                            case "DS18B20" :
                                console.log("DS18B20 =============================================================");
                                createStream(varbinds[0].value, DEFINE_SENSOR_TYPE_TEMPERATURE, String(varbinds[2].value));
                                break;
                            case "SHT" :
                                console.log("SHT =============================================================");
                                createStream(varbinds[0].value, DEFINE_SENSOR_TYPE_HUMIDITY, String(varbinds[2].value));
                                break;
                        }

                        console.log("================================================================");
                    }
                });

            }
        } else {
            console.log('not for');
        }
    });
}
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Dashboard', sensors: monitorList});
});

function getOID(_sensorName, _index) {
    // [센서값, 센서타입, 센서아이디, 엣지노드맥어드래스]
    var oids;
    switch (_sensorName) {
//        case 'PT100' :
//            oids = ['1.3.6.1.4.1.42251.1.3.2.3.2.1.6.' + _index, '' + _index, '' + _index];
//            break;
        case 'TEMPERATURE' :
            oids = ['1.3.6.1.4.1.42251.1.3.256.2.1.6.' + _index, '1.3.6.1.4.1.42251.1.3.2.3.2.1.2.' + _index, '1.3.6.1.4.1.42251.1.3.2.3.2.1.1.' + _index, '1.3.6.1.4.1.42251.1.2.2.0'];
            break;
        case 'HUMIDITY' :
            oids = ['1.3.6.1.4.1.42251.1.3.512.2.1.6.' + _index, '1.3.6.1.4.1.42251.1.3.2.4.2.1.2.' + _index, '1.3.6.1.4.1.42251.1.3.2.4.2.1.1.' + _index, '1.3.6.1.4.1.42251.1.2.2.0'];
            break;
        case 'DIGITAL INPUT' :
            oids = ['1.3.6.1.4.1.42251.1.3.1281.2.1.6.' + _index, '1.3.6.1.4.1.42251.1.3.2.2.2.1.2.' + _index, '1.3.6.1.4.1.42251.1.3.2.2.2.1.1.' + _index, '1.3.6.1.4.1.42251.1.2.2.0'];
            break;
//        case 'DO' :
//            oids = ['1.3.6.1.4.1.42251.1.3.3.2.2.1.6.' + _index, '1.3.6.1.4.1.42251.1.3.3.2.2.1.2.' + _index, '1.3.6.1.4.1.42251.1.3.3.2.2.1.1.' + _index, '1.3.6.1.4.1.42251.1.2.2.0'];
//            break;
    }
    return oids;
}

function createStream( _value, _index, _sensorId )
{
    var defaultURL = 'http://iotsharewebapi.azurewebsites.net/api/SensorRawData?sessionKey=3230313430373037313331363&DeviceID=00405c8d0e8a&';
    var date = getDate();
    var valueFileNamePath;
    switch ( _index )
    {
        case DEFINE_SENSOR_TYPE_TEMPERATURE :
            if (_sensorId == "01030001") {
                defaultURL += 'SensorID=00405C8DEF0101010001&sensorType=1&recordTime=' + date;
            } else {
                defaultURL += 'SensorID=00405C8DEF0101010005&sensorType=1&recordTime=' + date;
            }
            valueFileNamePath = "./db/temperature.txt";
            break;
        case DEFINE_SENSOR_TYPE_HUMIDITY :
            defaultURL += 'SensorID=00405C8DEF0101010002&sensorType=2&recordTime=' + date;
            valueFileNamePath = "./db/humidity.txt";
            break;
//        case DEFINE_SENSOR_TYPE_FLOODING :
//            defaultURL += 'SensorID=00405C8DEF0101010003&sensorType=3&recordTime=' + date;
//            valueFileNamePath = "./db/flooding.txt";
//            break;
        case DEFINE_SENSOR_TYPE_DOOR :
            defaultURL += 'SensorID=00405C8DEF0101010004&sensorType=4&recordTime=' + date;
            valueFileNamePath = "./db/door.txt";
            break;
    }

    //Start the request
    var options = {
        url: defaultURL,
        method: 'POST',
        headers: headers
    };

    console.log( 'sensor : type = ' + _index + ", value = " + _value + ", time = " + date );
    var st = fs.createWriteStream(valueFileNamePath);
    st.on('finish', function () {
        fs.createReadStream(valueFileNamePath).pipe( request( options, function ( error, response, body ) {
            //console.log( "response.statusCode = " + response.statusCode );
            if ( !error && response.statusCode == 200 ) {
                // Print out the response body
                console.log( body );
            }
        }));
    });
    st.write(_value + '\n');
    st.end();
}

var PushSensor = function () {
    var self = this;
    setInterval( function() {
        self.emit('push');
    }, 60000);
};
util.inherits(PushSensor, EventEmitter);

var pushSensor = new PushSensor();
pushSensor.on('push', function () {
    sendSensorValues();
    console.log("loop");
});


module.exports = router;

var express = require('express');
var request = require('request');
var fs = require('fs');
var discovery = require('./route_discovery');
var async = require('async');
var router = express.Router();
var isDEV = false;

// dummy json
var str = {
    "model":"FTE-ES2",
    "type":"status",
    "title":"Status",
    "LUT":"1407920687",
    "RI":"5",
    "product_info":{"descs" : [
        {"title":"ID","value":"4db10000446c00150014001027894e45"},
        {"title":"Model","value":"FTE-ES2"},
        {"title":"Manufacturer","value":"FutureTek,Inc."},
        {"title":"H/W Version","value":"1.1.1.1"},
        {"title":"S/W Version","value":"1.0.0.0"},
        {"title":"IP Address","value":"10.0.1.46"}
    ]},
    "groups":[
        {
            "name":"DS18B20",
            "fields":["OID","NAME","VALUE","STATUS","S/N"],
            "objects":[
                {
                    "id":"01030001",
                    "name":"DS18B20-16973825",
                    "value":"24.87",
                    "status":"E-V"
                },
                {
                    "id":"01030000",
                    "name":"DS18B20-16973824",
                    "value":"25.37",
                    "status":"E-V"
                }
            ]
        },
        {
            "name":"SHT",
            "fields":["OID","NAME","VALUE","STATUS"],
            "objects":[
                {
                    "id":"02010001",
                    "name":"SHT-1",
                    "value":"49.34",
                    "status":"E-V"
                }
            ]
        }
    ]
};

/*
var options = [{
    url: 'http://10.0.1.43/request.cgi?cmd=view&page=status',
    method: 'GET'
},
{
    url: 'http://10.0.1.46/request.cgi?cmd=view&page=status',
    method: 'GET'
}];
*/

/* GET home page. */
router.get('/', function(req, res) {
    if ( isDEV ) {

        var edgenodes = [];
        async.waterfall([
            function (cb) {
                for (var y=0; y<2; y++) {
                    // 센서 리스트를 가져온다.
                    var json = str;

                    var monitorStatus = [];
                    for (var i = 0; i < json.groups.length; i++) {
                        monitorStatus[i] = [];
                        for (var k = 0; k < json.groups[i].objects.length; k++) {
                            monitorStatus[i].push(0);
                        }
                    }

                    // 현재 모니터링 하고 있는 센서들이 있는지 여부를 확인한다.
                    var monitorList = "";
                    fs.exists('./db/monitoring.json', function (exists) {
                        if (exists) {
                            // 현재 모니터링 하고 있는 센서 리스트를 가져온다.
                            var readMonitoringData = fs.readFileSync('./db/monitoring.json', 'utf-8');

                            // 쿼리
                            if (readMonitoringData != "") {
                                monitorList = JSON.parse(readMonitoringData);
                                //console.log(monitorStatus);
                                for (var j = 0; j < monitorList.length; j++) {
                                    for (var i = 0, l = json.groups.length; i < l; i++) {
                                        for (var k = 0, h = json.groups[i].objects.length; k < h; k++) {
                                            //console.log(monitorList[j]['sensorId']);
                                            if (json.groups[i].objects[k].id === monitorList[j]['sensorId']) {
                                                //console.log(monitorStatus[i]);
                                                monitorStatus[i].splice(k, 1, 1);
                                            }
                                        }
                                    }
                                }

                            }
                            edgenodes.push([json, monitorList, monitorStatus]);
                            if (edgenodes.length == 2) {
                                cb(null, edgenodes);
                            }
                        } else {
                            edgenodes.push([json, monitorList, monitorStatus]);
                            if (edgenodes.length == 2) {
                                cb(null, edgenodes);
                            }
                        }
                    });
                }

            },
            function (data, cb) {
                res.render('sensorlist', { title: 'Dashboard - Sensor list', edgenodes: data });
            }
        ]);

    } else {

        var edgenodes = [];
        var options = [];
        async.waterfall([
            function (cb) {
                discovery.getSensorValue();
                discovery.discover.on('getIps', function(_data) {
                    //console.log(_data);
                    options.push({
                        url: 'http://'+ _data +'/request.cgi?cmd=view&page=status',
                        method: 'GET'
                    });
                });
                setTimeout(function() {
                    cb(null, options);
                    console.log(options);
                }, 1000);
            },
            function (options, cb) {
                for (var y = 0; y < options.length; y++) {
                    request(options[y], function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var json = JSON.parse(body);

                            var monitorStatus = [];
                            for (var i = 0; i < json.groups.length; i++) {
                                monitorStatus[i] = [];
                                for (var k = 0; k < json.groups[i].objects.length; k++) {
                                    monitorStatus[i].push(0);
                                }
                            }
                            console.log("init monitorStatus = " + monitorStatus);

                            // 현재 모니터링 하고 있는 센서들이 있는지 여부를 확인한다.
                            var monitorJson = "";
                            fs.exists('./db/monitoring.json', function (exists) {
                                if (exists) {
                                    // 현재 모니터링 하고 있는 센서 리스트를 가져온다.
                                    var readMonitoringData = fs.readFileSync('./db/monitoring.json', 'utf-8');

                                    // 쿼리
                                    if (readMonitoringData != "") {
                                        monitorJson = JSON.parse(readMonitoringData);
                                        //console.log(monitorStatus);
                                        for (var j = 0; j < monitorJson.length; j++) {
                                            for (var i = 0, l = json.groups.length; i < l; i++) {
                                                for (var k = 0, h = json.groups[i].objects.length; k < h; k++) {
                                                    //console.log(monitorList[j]['sensorId']);
                                                    if (json.groups[i].objects[k].id === monitorJson[j]['sensorId'] &&
                                                        json.product_info.descs[0].value === monitorJson[j]['edgenodeId']) {
                                                        //console.log(monitorStatus[i]);
                                                        monitorStatus[i].splice(k, 1, 1);
                                                    }
                                                }
                                            }
                                        }

                                    }
                                    console.log("monitorStatus = " + monitorStatus);
                                    edgenodes.push([json, monitorStatus]);
                                    if (edgenodes.length == 2) {
                                        cb(null, edgenodes, monitorJson);
                                    }
                                } else {
                                    edgenodes.push([json, monitorStatus]);
                                    if (edgenodes.length == 2) {
                                        cb(null, edgenodes, monitorJson);
                                    }
                                }
                            });
                        }
                    });
                }
            },
            function (data, list, cb) {
                res.render('sensorlist', { title: 'Dashboard - Sensor list', edgenodes: data, list:list});
            }
        ])
    }
});

router.get('/savejson/:edgenode/:sensor/:name/:desc/:sensorId/:edgenodeId/:ismodify?', function(req, res) {
    if (req.params.edgenode == undefined || req.params.sensor == undefined ||
        req.params.name == undefined || req.params.desc == undefined ||
        req.params.sensorId == undefined || req.params.edgenodeId == undefined ||
        req.params.ismodify == undefined) {
        res.send('fail');
    } else {
        res.send("success");
        writeMonitoringList(req.params.edgenode, req.params.sensor, req.params.name, req.params.desc, req.params.sensorId, req.params.edgenodeId, req.params.ismodify);
    }
});

router.get('/deletejson/:sensorId?', function(req, res) {
    var json;
    var readData = fs.readFileSync('./db/monitoring.json', 'utf-8');
    if (readData != "") {
        json = JSON.parse(readData);
    } else {
        json = [];
        console.log("exist..but empty");
    }

    for (var i = 0; i < json.length; i++) {
        if (json[i].sensorId == req.params.sensorId) {
            console.log(i);
            json.splice(i, 1);
        }
    }

    var stream = fs.createWriteStream('./db/monitoring.json');
    stream.on('finish', function () {
        console.log('save json');
        res.send("success");
    });
    stream.write(JSON.stringify(json));
    stream.end();
});

function writeMonitoringList(_edgenode, _sensor, _name, _desc, _sensorId, _edgenodeId, _ismodify) {

    // 파일이 없거나 비어있으면 새로 만들기를 해야함.
    fs.exists('./db/monitoring.json', function (exists) {
        var json;
        if (exists) {
            var readData = fs.readFileSync('./db/monitoring.json', 'utf-8');
            if (readData != "") {
                json = JSON.parse(readData);
                console.log("exists!");
            } else {
                json = [];
                console.log("exist..but empty");
            }
        } else {
            console.log("no exists!");
            json = [];
        }

        var make_json = {
            edgenode: _edgenode,
            edgenodeId: _edgenodeId,
            sensor: _sensor,
            sensorId: _sensorId,
            name: _name,
            description: _desc
        };

        // 쿼리
        if (_ismodify == "modify") {
            for (var i = 0; i < json.length; i++) {
                if (json[i].sensorId === _sensorId) {
                    //console.log(i);
                    json.splice(i, 1, make_json);
                }
            }
        } else {
            json.push(make_json);
        }

        var stream = fs.createWriteStream('./db/monitoring.json');
        stream.on('finish', function () {
            console.log('save json');
        });
        stream.write(JSON.stringify(json));
        stream.end();

    });
}

module.exports = router;
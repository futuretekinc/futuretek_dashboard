var express = require('express');
var request = require('request');
var fs = require('fs');
var router = express.Router();
var isDEV = true;

var DEFINE_MONITOR_STATUS_OFF = 0,
    DEFINE_MONITOR_STATUS_ON = 1;

// dummy json
var str = '{"model":"FTE-ES1","type":"status","title":"Status","LUT":"1850","RI":"5","product_info":{"descs" : [{"title":"ID","value":"52c10000446c000f0013001027894e45"},{"title":"Model","value":"FTE-ES1"},{"title":"Manufacturer","value":"FutureTek,Inc."},{"title":"H/W Version","value":"1.1.1.1"},{"title":"S/W Version","value":"1.0.0.0"},{"title":"IP Address","value":"10.0.1.35"}]},"groups":[{"name":"LED","fields":["OID","NAME","VALUE","STATUS","CTRL"],"objects":[{"id":"06030001","name":"STATUS","value":"OFF","status":"E-V"}]},{"name":"PT100","fields":["OID","NAME","VALUE","STATUS"],"objects":[{"id":"01010001","name":"RTD-1","value":"24.40","status":"E-V"}]},{"name":"SHT","fields":["OID","NAME","VALUE","STATUS"],"objects":[{"id":"02010001","name":"SHT-1","value":"53.40","status":"E-V"}]}]}';

var options = {
    url: 'http://10.0.1.37/request.cgi?cmd=view&page=status',
    method: 'GET'
};

/* GET home page. */
router.get('/', function(req, res) {
    if ( isDEV ) {
        // 센서 리스트를 가져온다.
        var json = JSON.parse(str);
        var monitorStatus = [];
        for (var i = 0, l = json.groups.length; i < l; i++) {
            monitorStatus.push(DEFINE_MONITOR_STATUS_OFF);

        }

        // 현재 모니터링 하고 있는 센서들이 있는지 여부를 확인한다.
        var monitorList="";
        fs.exists('./db/monitoring.json', function (exists) {
            if (exists) {
                // 현재 모니터링 하고 있는 센서 리스트를 가져온다.
                var readMonitoringData = fs.readFileSync('./db/monitoring.json', 'utf-8');

                // 쿼리
                if (readMonitoringData != "") {
                    monitorList = JSON.parse(readMonitoringData);
                    console.log(monitorStatus);
                    for (var j=0; j < monitorList.length; j++) {
                        for (var i = 0, l = json.groups.length; i < l; i++) {

                            if (json.groups[i].objects[0].id === monitorList[j]['sensorId']) {
                                console.log(json.groups[i]);
                                monitorStatus.splice(i, 1, 1);
                            }
                        }
                    }
                    console.log(monitorStatus);
                }

                res.render('sensorlist', { title: 'Dashboard - Sensor list', sensors: json.groups, edgenode: json.product_info.descs, monitoring: monitorList, status: monitorStatus});
            } else {
                res.render('sensorlist', { title: 'Dashboard - Sensor list', sensors: json.groups, edgenode: json.product_info.descs, monitoring: monitorList, status: monitorStatus});
            }
        });

    } else {

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(body);
                res.render('sensorlist', { title: 'Dashboard - Sensor list', sensors: json.groups, edgenode: json.product_info.descs });
            }
        });
    }
});

router.get('/savejson/:index/:edgenode/:sensor/:name/:desc/:sensorId/:edgenodeId/:ismodify?', function(req, res) {
    if (req.params.edgenode == undefined || req.params.sensor == undefined ||
        req.params.name == undefined || req.params.desc == undefined ||
        req.params.sensorId == undefined || req.params.edgenodeId == undefined ||
        req.params.ismodify == undefined) {
        res.send('fail');
    } else {
        res.send("success");
        writeMonitoringList(req.params.index, req.params.edgenode, req.params.sensor, req.params.name, req.params.desc, req.params.sensorId, req.params.edgenodeId, req.params.ismodify);
    }
});

router.get('/deletejson/:index', function(req, res) {
    var json;
    var readData = fs.readFileSync('./db/monitoring.json', 'utf-8');
    if (readData != "") {
        json = JSON.parse(readData);
    } else {
        json = [];
        console.log("exist..but empty");
    }

    for (var i = 0; i < json.length; i++) {
        if (json[i].index == req.params.index) {
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

function writeMonitoringList(_index, _edgenode, _sensor, _name, _desc, _sensorId, _edgenodeId, _ismodify) {

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
            index: _index,
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
                if (json[i].index === _index) {
                    console.log(i);
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
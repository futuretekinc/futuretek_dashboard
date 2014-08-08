var express = require('express');
var request = require('request');
var fs = require('fs');
var router = express.Router();
var isDEV = true;

// dummy json
var str = '{"model":"FTE-ES1","type":"status","title":"Status","LUT":"1850","RI":"5","product_info":{"descs" : [{"title":"ID","value":"52c10000446c000f0013001027894e45"},{"title":"Model","value":"FTE-ES1"},{"title":"Manufacturer","value":"FutureTek,Inc."},{"title":"H/W Version","value":"1.1.1.1"},{"title":"S/W Version","value":"1.0.0.0"},{"title":"IP Address","value":"10.0.1.35"}]},"groups":[{"name":"LED","fields":["OID","NAME","VALUE","STATUS","CTRL"],"objects":[{"id":"06030001","name":"STATUS","value":"OFF","status":"E-V"}]},{"name":"PT100","fields":["OID","NAME","VALUE","STATUS"],"objects":[{"id":"01010001","name":"RTD-1","value":"24.40","status":"E-V"}]},{"name":"SHT","fields":["OID","NAME","VALUE","STATUS"],"objects":[{"id":"02010001","name":"SHT-1","value":"53.40","status":"E-V"}]}]}';

var options = {
    url: 'http://10.0.1.35/request.cgi?cmd=view&page=status',
    method: 'GET'
};

/* GET home page. */
router.get('/', function(req, res) {
    if ( isDEV ) {

        fs.exists('./db/monitoring.json', function (exists) {
            if (exists) {

            } else {

            }
        });

        var json = JSON.parse(str);
        var readData = fs.readFileSync('./db/monitoring.json', 'utf-8');
        var readJson = JSON.parse(readData);
        console.log(json.groups)
        // 쿼리
        var json2 = [];
        if (readJson != "") {

            var i = 0;
            var monitorList = [];
            for (i = 0; i < readJson.length; i++) {
                monitorList.push(readJson[i]['sensorId']);
            }
            console.log(monitorList);
            var test = [];

            for (i = 0, l = json.groups.length; i < l; i++) {
                test.push(0);
            }
            console.log("! = " + test);
            for (var j=0; j < monitorList.length; j++) {
                for (i = 0, l = json.groups.length; i < l; i++) {

                    if (json.groups[i].objects[0].id === monitorList[j]) {
                        console.log(json.groups[i]);
                        test.splice(i, 1, 1);
                    }
                }
            }
            console.log(test);
        }


        //console.log("json2 = " + json2);
        res.render('sensorlist', { title: 'Dashboard - Sensor list', sensors: json.groups, edgenode: json.product_info.descs, monitoring: readJson, test: test});
    } else {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(body);
                res.render('sensorlist', { title: 'Dashboard - Sensor list', sensors: json.groups, edgenode: json.product_info.descs });
            }
        });
    }
});

//console.log(querySensorId("01010001"));
function querySensorId(_id) {
    var readData = fs.readFileSync('./db/monitoring.json', 'utf-8');
    console.log("readData" + readData);
    if (readData == "") {
        return 1;
    } else {
        console.log("asdf")
    }
    var json = JSON.parse(readData);

    // 쿼리
    for (var i = 0, l = json.length; i < l; i++){

        if (json[i]['sensorId'] == _id) {
            return json[i];
        }
    }
    return false;
}

router.get('/savejson/:index/:edgenode/:sensor/:name/:desc/:sensorId?', function(req, res) {
    if (req.params.edgenode == undefined || req.params.sensor == undefined ||
        req.params.name == undefined || req.params.desc == undefined || req.params.sensorId == undefined) {
        res.send('fail');
    } else {
        res.send("success");
        writeMonitoringList(req.params.index, req.params.edgenode, req.params.sensor, req.params.name, req.params.desc, req.params.sensorId);
    }
});

function writeMonitoringList(_index, _edgenode, _sensor, _name, _desc, _sensorId) {

    // 파일이 없거나 비어있으면 새로 만들기를 해야함.
    fs.exists('./db/monitoring.json', function (exists) {

        var json;

        if (exists) {
            console.log("exists!");
            var readData = fs.readFileSync('./db/monitoring.json', 'utf-8');
            json = JSON.parse(readData);
        } else {
            console.log("no exists!");
            json = [];
        }

        json.push({
            index: _index,
            edgenode: _edgenode,
            sensor: _sensor,
            sensorId: _sensorId,
            name: _name,
            description: _desc
        });

        var stream = fs.createWriteStream('./db/monitoring.json');
        stream.on('finish', function () {
            console.log('save json');
        });
        stream.write(JSON.stringify(json));
        stream.end();

    });
}

module.exports = router;
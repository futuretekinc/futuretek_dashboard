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
        var json = JSON.parse(str);
        res.render('sensorlist', { title: 'Dashboard - Sensor list', sensors: json.groups, edgenode: json.product_info.descs });
    } else {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(body);
                res.render('sensorlist', { title: 'Dashboard - Sensor list', sensors: json.groups, edgenode: json.product_info.descs });
            }
        });
    }
});

//// readFile
var readJson;
fs.readFile('./db/monitoring.json', function (err, data) {
    if (err) throw err;
    console.log(JSON.parse(data));
    readJson = JSON.parse(data);
    console.log(readJson[0]);
});

router.get('/savejson/:index/:edgenode/:sensor/:name/:desc?', function(req, res) {
    if (req.params.edgenode == undefined || req.params.sensor == undefined ||
        req.params.name == undefined || req.params.desc == undefined ) {
        res.send('fail');
    } else {
        res.send("success");
        writeMonitoringList(index, req.params.edgenode, req.params.sensor, req.params.name, req.params.desc);
    }
});

function writeMonitoringList(_index, _edgenode, _id, _name, _desc) {
    var json = {
        index: _index,
        edgenode: _edgenode,
        id: _id,
        name: _name,
        description: _desc
    };

    var stream = fs.createWriteStream('./db/monitoring.json');
    stream.on('finish', function () {
        console.log('save json');
    });
    stream.write(JSON.stringify(json));
    stream.end();
}

module.exports = router;
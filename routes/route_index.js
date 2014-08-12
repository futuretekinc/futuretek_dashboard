var express = require('express');
var fs = require('fs');
var snmp = require('net-snmp');
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

            res.render('index', { title: 'Dashboard', sensors: monitorList});
        } else {
            res.render('index', { title: 'Dashboard', sensors: monitorList});
        }
    });
});

module.exports = router;
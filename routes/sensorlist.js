var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('sensorlist', { title: 'Dashboard - Sensor list' });
});

module.exports = router;
var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');

// var sensorSchema = mongoose.Schema ({
// 	"index" : Number,
// 	"id" : String,
// 	"name" : String,
// 	"desc" : String,
// 	"status" : Number,
// 	"type" : Number
// }, { versionKey: false });

//var Sensors = mongoose.model('Sensors', sensorSchema);

// // save db
// router.get('/save', function(req, res) {
// 	console.log ( req.query.index, req.query.id, req.query.name, req.query.desc, req.query.status, req.query.type );
// 	var newSensors = new Sensors();
// 	newSensors.index = req.query.index;
// 	newSensors.id = req.query.id;
// 	newSensors.name = req.query.name;
// 	newSensors.desc = req.query.desc;
// 	newSensors.status = req.query.status;
// 	newSensors.type = req.query.type;
	
// 	newSensors.save( function( err ) {
// 		// saving is asynchronous
// 	  	if (err) {
// 	  		console.log("Something went wrong while saving the thing");
// 	  		res.send( "error" );
// 	  	} else {
// 	  		console.log("Sensor was successfully saved");
// 	  		res.send( "ok" );
// 	  	}
// 	});
// });

/* GET home page. */
router.get('/', function(req, res) {
	res.render('setting', { title: 'Dashboard - Setting' });
});

module.exports = router;
var express = require('express');
var router = express.Router();
/*
var mongoose = require('mongoose');

mongoose.connect('mongodb://kindmong:kid10129@dbh85.mongolab.com:27857/kindmongdb');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  	// Create your schemas and models here.
  	console.log( "connection successful.." );
});

var sensorSchema = mongoose.Schema ({
	"index" : Number,
	"id" : String,
	"name" : String,
	"desc" : String,
	"status" : Number,
	"type" : Number
}, { versionKey: false });

var Sensors = mongoose.model('Sensors', sensorSchema);
*/
/* GET home page. */
router.get('/', function(req, res) {
	res.send( 'sensors server test' );
});

router.get('/list', function(req, res) {
	res.send( 'sensors list' );
	// Sensors.find( function( err, sensor ) {
	//   	if ( err ) return console.error( err );
	//   	console.dir( sensor );
	//   	res.send( sensor );
	// });
});

// save db
/*
router.get('/save', function(req, res) {
	console.log ( req.query.index, req.query.id, req.query.name, req.query.desc, req.query.status, req.query.type );
	var newSensors = new Sensors();
	newSensors.index = req.query.index;
	newSensors.id = req.query.id;
	newSensors.name = req.query.name;
	newSensors.desc = req.query.desc;
	newSensors.status = req.query.status;
	newSensors.type = req.query.type;
	
	newSensors.save( function( err ) {
		// saving is asynchronous
	  	if (err) {
	  		console.log("Something went wrong while saving the thing");
	  		res.send( "error" );
	  	} else {
	  		console.log("Sensor was successfully saved");
	  		res.send( "ok" );
	  	}
	});
});
*/
module.exports = router;
// set up ======================================================================
var express  = require('express');
var io = require('socket.io');
var app      = express(); 								// create our app w/ express
var http = require ('http'); 				    		// For serving a basic web page.
var server = http.createServer(app);
var io = io.listen(server);
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config

var busboy = require('connect-busboy');
var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration ===============================================================

// connect to mongoDB database on modulus.io
// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(database.url, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + database.url + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + database.url);
  }
}); 	

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + database.url);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(busboy()); 												// for uploading files
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// routes ======================================================================
require('./app/routes.js')(app);

// sockets ======================================================================
require('./sockets/base')(io);

// listen (start app with node server.js) ======================================
// app.listen(port);	
server.listen(port);

console.log("App listening on port " + port);


/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
	  message: err.message,
	  error: err
	});
});





var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/routes');
var api = require('./routes/api');

var app = express();

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(params);

app.use('/api', api);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//MongoClient.connect('mongodb://104.236.25.185:27017/test', function(err, db) {
//    if(err) {
//        throw err;
//    } else {
//        console.log("successfully connected to the database");
//    }
//    db.close();
//});

//Example database interaction
//Run: "node app.js" to see it's output
var databaseUrl = "mydb";
var collections = ["users", "groups", "events", "photos"]
var db = require("mongojs").connect(databaseUrl, collections);

//Removes everthing in the users collection
db.users.remove(); 

//Adds "Ammon" to the users collection
db.users.save({name:"Ammon", password:"byucougars", sex:"male"},
		function(err, saved) {
	if( err || !saved ) console.log("users not saved");
	else{
		console.log("Users saved");
		findMale();
	};
});

function findMale(){
	//finds any users that are male and prints out their name attribute
	db.users.find({sex:"male"}, function(err, users) {
		if( err || !users) console.log("no male users found");
		else users.forEach( function(maleUser) {
			console.log("Male users:");
			console.log(maleUser.name);
		});
	});
}

module.exports = app;

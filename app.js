var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/routes');
var api = require('./routes/api');

var app = express();

var mongo = require('mongodb');
var mongoose = require('mongoose');
//var db = mongoose.createConnection('mongodb://localhost/memshare');
mongoose.connect('mongodb://localhost/memshare');
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function callback() {
    console.log("connected succesfully in app.js");
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

// json setup
app.set("json spaces", 4);

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
app.use(function(req, res) {
    res.render("404");
    //var options = {
    //    root: __dirname + "/public/"
    //};

    //res.sendFile("images/404.png", options, function(err) {
    //    if (err) {
    //        res.sendStatus(404);
    //    }
    //});
});
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

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

module.exports = app;

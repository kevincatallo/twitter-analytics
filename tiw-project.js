/*jslint node: true nomen: true es5: true */
'use strict';

var express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./config.js'),
    passport = require('./lib/passport.js')(config.twitter),
    twitterRouter = require('./route/twitter.js')(passport, config.twitter),
    app = express();

// view engine
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'view'));

// cookie parsing & sessions
app.use(cookieParser(config.cookieSecret));
app.use(session({
    secret: config.cookieSecret,
    cookie: {
        domain: '.tiw-ta.org'
    },
    saveUninitialized: false,
    resave: false
}));

// body parsing
app.use(bodyParser.urlencoded({
    extended: true
}));

// authentication
app.use(passport.initialize());
app.use(passport.session());

// logger
app.use(require('morgan')('dev'));

// static files
app.use(express.static(path.join(__dirname, 'public/build')));

// routes
app.use(twitterRouter);

// listening
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('the requester app is listening on ' + port);
});
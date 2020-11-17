/*jslint node: true nomen: true es5: true */
'use strict';

var express = require('express'),
    _ = require('underscore'),
    twitterClient = require('../lib/twitter-client.js'),
    validateSelectedFollowers = require('../validate/selected-followers.js'),
    common = require('./common.js'),
    LimitExceededError = require('../error/limit-exceeded-error.js'),
    TwitterError = require('../error/twitter-error.js');

module.exports = function makeTwitterRouter(passport, twitterConfig) {

    var router = express.Router();
    
    // authentication
    router.get('/auth/twitter', passport.authenticate('twitter'));

    router.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/me',
        failureRedirect: '/'
    }));
    
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    
    // web pages
    router.get('/', function (req, res, next) {
        return req.user ? res.redirect('/me') : res.render('login');
    });

    router.get('/me',
        common.checkAuthentication,
        function (req, res, next) {
            res.render('me', {user: req.user});
        });

    router.get('/followers',
        common.checkAuthentication,
        function (req, res, next) {
            res.render('followers', {user: req.user});
        });

    router.post('/followers',
        common.checkAuthentication,
        function (req, res, next) {
            var errors = validateSelectedFollowers(req.body);
            if (errors.length) {
                return res.render('followers', {error: true});    
            }
            next();
        },
        function (req, res, next) {
            req.session.selectedFollowerScreenNames = req.body.selectedFollowerScreenNames;
            res.redirect('/selected-followers');
        });
    
    router.get('/selected-followers',
        common.checkAuthentication,
        function (req, res, next) {
            res.render('selected-followers', {user: req.user});
        });

    router.get('/graph',
        common.checkAuthentication,
        function (req, res, next) {
            res.render('graph', {user: req.user});
        });

    // API part
    router.get('/api/me',
        common.checkAuthentication,
        function (req, res, next) {
            res.json(_.omit(req.user, 'twitterOpts'));
        });
    
    router.get('/api/:screenName/followers',
        common.checkAuthentication,
        function (req, res, next) {

            var twitterOpts = req.user.twitterOpts,
                screenName = req.params.screenName,
                cursor = -1;

            // check the cursor
            if (req.query.cursor) {
                cursor = req.query.cursor;
            }

            if (req.params.screenName === 'me') {
                screenName = req.user.screenName;
            }

            twitterClient
                .getFollowerListPage(twitterOpts, screenName, cursor)
                .then(function (followerListPage) {
                    res.json(followerListPage);
                })
                .catch(LimitExceededError, function () {
                    return res.status(429).json();
                })
                .catch(TwitterError, function() {
                    return res.status(500).json();
                })
                .done();
        });

    router.get('/api/selected-followers',
        common.checkAuthentication,
        function (req, res, next) {
            var twitterOpts = req.user.twitterOpts,
                selectedFollowerScreenNames = req.session.selectedFollowerScreenNames;
        
            if (!selectedFollowerScreenNames) {
                return res.json([]);
            }
            
            twitterClient.getUsers(twitterOpts, selectedFollowerScreenNames)
                .then(function (followers) {
                    return res.json(followers);
                })
                .catch(function (error) {
                    console.log('problema'); // TODO: implement 
                });
        });

    return router;
};

// TODO: implement a nice looking 404 page
/*jslint node: true nomen: true es5: true */
'use strict';

var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    TwitterUser = require('../model/twitter-user.js'),
    cachedPassport;

module.exports = function (twitterConfig) {

    if (cachedPassport) {
        return cachedPassport;
    }

    // we keep the entire user profile in the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(
        new TwitterStrategy({
                consumerKey: twitterConfig.consumerKey,
                consumerSecret: twitterConfig.consumerSecret,
                callbackURL: twitterConfig.callbackURL
            },
            function (token, tokenSecret, profile, done) {

                var user = new TwitterUser(profile._json);
                user.twitterOpts = {
                    consumer_key: twitterConfig.consumerKey,
                    consumer_secret: twitterConfig.consumerSecret,
                    access_token_key: token,
                    access_token_secret: tokenSecret,
                };
                done(null, user);
            })
    );

    return passport;
};
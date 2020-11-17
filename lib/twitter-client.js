/*jslint node: true nomen: true es5: true */
'use strict';

var Twitter = require('twitter'),
    Promise = require('bluebird'),
    NodeCache = require('node-cache'),
    LimitExceededError = require('../error/limit-exceeded-error.js'),
    TwitterError = require('../error/twitter-error.js'),
    FollowerListPage = require('../model/follower-list-page.js'),
    followerListPageCache = new NodeCache({useClones: false}),
    userCache = new NodeCache({useClones: false});

function saveUsersToCache(users) {
    users.forEach(function (user) {
        userCache.set(user.screenName, user);        
    });
}
    
exports.getFollowerListPage = function (twitterOpts, screenName, cursor) {
    
    var followerParam = {
        'screen_name': screenName,
        'cursor': cursor
    };
    
    // if data are cached, return them right away
    var cachedFollowerListPage = followerListPageCache.get(JSON.stringify(followerParam));
    if (cachedFollowerListPage) {
        return Promise.resolve(cachedFollowerListPage);
    }

    // otherwise, go to twitter
    return new Promise(function (resolve, reject) {
        new Twitter(twitterOpts).get('followers/list', followerParam, function (error, data, response) {
            if (response.statusCode === 429) {
                return reject(new LimitExceededError('limit exceeded'));
            }

            if (response.statusCode !== 200) {
                return reject(new TwitterError('twitter error'));
            }
            
            var followerListPage = new FollowerListPage(data);
        
            followerListPageCache.set(JSON.stringify(followerParam), followerListPage);
            saveUsersToCache(followerListPage.followers);
                        
            resolve(followerListPage);
        });
    });
};

exports.getUsers = function (twitterOpts, screenNames) {
    
    var twitter = new Twitter(twitterOpts);
    
    return Promise.map(screenNames, function (screenName) {
        var cachedFollower = userCache.get(screenName);

        if (cachedFollower) {
            return Promise.resolve(cachedFollower);
        }
        
        return new Promise(function (resolve, reject) {
            twitter.get('users/lookup', {screen_name: screenName}, function (error, data, response) {
                var users = data.map(function (d) {
                    var user = new TwitterUser(d);
                    userCache.set(user.screenName, user);
                });
                resolve(user);
            });
        });
    })
};
/*jslint node: true nomen: true es5: true */
'use strict';

var Promise = require('bluebird'),
    $ = require('jquery'),
    _ = require('underscore'),
    PartialFollowerListError = require('../../../error/partial-follower-list-error.js'),
    TwitterError = require('../../../error/twitter-error.js');

require('babelify/polyfill');

function getFollowersOf(userScreenName) {

    return new Promise(function (resolve, reject) {
        var followers = [];

        function nextPage(cursor) {
            $.ajax({
                url: '/api/' + encodeURIComponent(userScreenName) + '/followers?cursor=' + cursor,
                dataType: 'json',
                success: function (followerListPage) {
                        followers = followers.concat(followerListPage.followers);
                        if (!followerListPage.nextCursor) {
                            return resolve(followers);
                        }
                        nextPage(followerListPage.nextCursor);
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 429) { 
                        reject(new PartialFollowerListError('partial follower list', followers));
                    }
                    if (xhr.status === 500) {
                        reject(new TwitterError('twitter error', followers));
                    }
                }
            });
        }
        nextPage(-1);
    });
}

function getSelectedFollowers_() {

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/api/selected-followers',
            dataType: 'json',
            statusCode: {
                200: function (data) {
                    resolve(data);
                }
            }
        });
    });
}

exports.getMe = function () {

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/api/me',
            dataType: 'json',
            success: function (user) {
                resolve(user);
            },
            error: function () {
                reject();
            }
        });
    });
};

exports.getFollowers = function () {
    return getFollowersOf('me');
};

exports.getSelectedFollowers = async function () {
    var selectedFollowers = await getSelectedFollowers_();
    
    selectedFollowers.forEach(function (sf) {sf.followers = [];});
    
    for (var i = 0; i < selectedFollowers.length; i++) {
        try {
          
            var followers = await getFollowersOf(selectedFollowers[i].screenName);
            selectedFollowers[i].followers = followers;
        
        } catch (e) {
        
            selectedFollowers[i].followers = e.followers;
        
            if (e instanceof PartialFollowerListError) {
                throw new PartialFollowerListError('partial list', selectedFollowers);    
            }
            if (e instanceof TwitterError) {
                throw new TwitterError('twitter error', selectedFollowers);    
            }
        }
    }
    return selectedFollowers;
}
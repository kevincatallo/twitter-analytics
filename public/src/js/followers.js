/*jslint node: true nomen: true es5: true */
'use strict';

var $ = require('jquery'),
    twitterClient = require('./twitter-client.js'),
    PartialFollowerListError = require('../../../error/partial-follower-list-error.js'),
    TwitterError = require('../../../error/twitter-error.js'),
    followerListTemplate = require('../template/follower-list.hbs'),
    preloaderTemplate = require('../template/preloader.hbs');

require('materialize-js');

$(function () {

    var preloaderContainer = $('#preloader-container');

    function showFollowerList(followers) {
        preloaderContainer.empty();
        $('#follower-list-container').html(followerListTemplate(followers));
    }
    
    function showFollowerListAndErrorModal(error) {
        showFollowerList(error.followers);
        $('#partial-follower-list-modal').openModal();
    }
    
    function showFollowerListAndTwitterErrorModal(error) {
        showFollowerList(error.followers);
        $('#twitter-error-modal').openModal(); 
    }
    
    preloaderContainer.html(preloaderTemplate());
    twitterClient.getFollowers()
        .then(showFollowerList)
        .catch(function (error) {
            if (error instanceof PartialFollowerListError) {
                showFollowerListAndErrorModal(error);    
            }
            if (error instanceof TwitterError) {
                showFollowerListAndTwitterErrorModal(error);    
            }
        });
});
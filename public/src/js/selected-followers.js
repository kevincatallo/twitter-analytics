/*jslint node: true nomen: true es5: true */
'use strict';

var $ = require('jquery'),
    twitterClient = require('./twitter-client.js'),
    PartialFollowerListError = require('../../../error/partial-follower-list-error.js'),
    TwitterError = require('../../../error/twitter-error.js'),
    preloaderTemplate = require('../template/preloader.hbs'),
    followerListTemplate = require('../template/hierarchical-follower-list.hbs');

require('materialize-js');

$(function () {

    var preloaderContainer = $('#preloader-container');

    function showFollowerList(followers) {
        preloaderContainer.empty();
        $('#hierarchical-follower-list-container').html(followerListTemplate(followers));
        $('.collapsible').collapsible({
            accordion: false
        });
    }

    function showFollowerListAndErrorModal(error) {
        console.log(error);
        $('#partial-follower-list-modal').openModal();
        showFollowerList(error.followers);
    }
    
    function showFollowerListAndTwitterErrorModal(error) {
        showFollowerList(error.followers);
        $('#twitter-error-modal').openModal();
    }

    preloaderContainer.html(preloaderTemplate());
    twitterClient
        .getSelectedFollowers()
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
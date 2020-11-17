/*jslint node: true nomen: true es5: true */
'use strict';

function TwitterUser(user) {
    this.screenName = user.screen_name;
    this.name = user.name;
    this.avatarUrl = user.profile_image_url.replace('_normal', '');
    this.location = user.location;
}

module.exports = TwitterUser;
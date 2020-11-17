/*jslint node: true nomen: true es5: true */
'use strict';

var TwitterUser = require('./twitter-user.js');

function FollowerListPage(data) {
    this.followers = data.users.map(function (u) {
        return new TwitterUser(u);
    });
    this.nextCursor = data.next_cursor;
}

module.exports = FollowerListPage;
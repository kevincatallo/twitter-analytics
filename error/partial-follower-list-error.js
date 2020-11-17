/*jslint node: true nomen: true es5: true */
'use strict';

var util = require('util');

function PartialFollowerListError(message, followers) {
    Error.call(this);
    this.message = message;
    this.followers = followers;
}

util.inherits(PartialFollowerListError, Error);

module.exports = PartialFollowerListError;
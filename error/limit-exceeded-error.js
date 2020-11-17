/*jslint node: true nomen: true es5: true */
'use strict';

var util = require('util');

function LimitExceededError(message) {
    Error.call(this);
    this.message = message;
}

util.inherits(LimitExceededError, Error);

module.exports = LimitExceededError;
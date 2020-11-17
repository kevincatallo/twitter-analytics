/*jslint node:true nomen: true es5: true */
'use strict';

var JaySchema = require('jayschema'),
    js = new JaySchema(),
    selectedFollowersSchema = require('../schema/selected-followers.js');

module.exports = function (body) {
     
    if (body.selectedFollowerScreenNames && !Array.isArray(body.selectedFollowerScreenNames)) {
        body.selectedFollowerScreenNames = [body.selectedFollowerScreenNames];
    }
    return js.validate(body, selectedFollowersSchema);
};
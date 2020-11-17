/*jslint node: true nomen: true es5: true */
'use strict';

exports.checkAuthentication = function (req, res, next) {
    if (!req.user) {
        return res.redirect('/');
    }
    next();
};
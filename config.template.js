/*jslint node: true nomen: true es5: true */
'use strict';

module.exports = {
    twitter: {
        consumerKey: '${CONSUMER_KEY}',
        consumerSecret: '${CONSUMER_SECRET}',
        callbackURL: 'http://www.tiw-ta.org:3000/auth/twitter/callback'
    },
    cookieSecret: '${COOKIE_SECRET}'
};

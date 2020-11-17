/*jslint node:true nomen: true es5: true */
'use strict';

module.exports = {
    type: 'object',
    properties: {
        selectedFollowerScreenNames: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            additionalItems: false,
            items: {
                type: 'string'    
            }
        }
    },
    additionalProperties: false,
    required: ['selectedFollowerScreenNames']
};
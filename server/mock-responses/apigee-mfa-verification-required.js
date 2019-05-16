const moment = require('moment');

module.exports = function() {
    const expiry = moment().add(3, 'm');
    return {
        'token': null,
        'status': 'MFA_VERIFICATION_REQUIRED',
        'multifactor': {
            'state': {
                'token': '00Bh3IWHKwXrsbsvJXbPuaax2LB6QupGEc5WglmYln',
                'expiry': expiry.toISOString()
            },
            'factors': [{
                'type': 'OneTimeToken',
                'provider': 'OKTA',
                '_links': [{
                    'rel': 'verify',
                    'method': 'post',
                    'href': 'http://localhost:3100/auth/experianone/v1/factors/ostffjoz3nK7Q6YqG0h7/verify'
                }]
            }]
        }
    };
};
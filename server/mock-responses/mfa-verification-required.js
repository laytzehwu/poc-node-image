var moment = require('moment');

module.exports = function() {
    var expiry = moment().add(3, 'm');
    var response = {
        'token': null,
        'status': 'MFA_VERIFICATION_REQUIRED',
        'multifactor': {
            'state': {
                'token': '007UvMgWPQVKo7eBqbH0frVx3NU-cbkdVlfFGOqF9b',
                'expiry': expiry.toISOString()
            },
            'factors': [{
                'type': 'OneTimeToken',
                'provider': 'OKTA',
                '_links': [{
                    'rel': 'verify',
                    'method': 'post',
                    'href': 'http://localhost:3100/v0/factors/uftbnvjjtjFTaEN200h7/verify'
                }]
            }]
        }
    };

    return JSON.stringify(response);
}
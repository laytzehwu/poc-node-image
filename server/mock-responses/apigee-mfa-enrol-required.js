const moment = require('moment');

module.exports = function () {
    const expiry = moment().add(3, 'm');
    return {
        token: null,
        status: 'MFA_ENROLL_REQUIRED',
        multifactor: {
            state: {
                token: '00Bh3IWHKwXrsbsvJXbPuaax2LB6QupGEc5WglmYln',
                expiry: expiry.toISOString()
            },
            factors: [{
                type: 'SecurityQuestion',
                provider: 'OKTA',
                _links: [
                    {
                        rel: 'question',
                        method: 'get',
                        href: 'http://localhost:3100/auth/experianone/v1/factors/questions'
                    },
                    {
                        rel: 'enroll',
                        method: 'post',
                        href: 'http://localhost:3100/auth/experianone/v1/factors'
                    }
                ]
            }, {
                type: 'OneTimeToken',
                provider: 'OKTA',
                _links: [
                    {
                        rel: 'enroll',
                        method: 'post',
                        href: 'http://localhost:3100/auth/experianone/v1/factors'
                    }
                ]
            }]
        }
    };
};
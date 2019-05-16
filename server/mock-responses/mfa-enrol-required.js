var moment = require('moment');

module.exports = function () {
    var expiry = moment().add(3, 'm');
    var response = {
        token: null,
        status: 'MFA_ENROLL_REQUIRED',
        multifactor: {
            state: {
                token: '00R118CwpGl1R9u2LchaP0Jt5QSUtY-Vh_ck3HWrzU',
                expiry: expiry.toISOString()
            },
            factors: [{
                type: 'SecurityQuestion',
                provider: 'OKTA',
                _links: [
                    {
                        rel: 'question',
                        method: 'get',
                        href: 'http://localhost:3100/v0/factors/questions'
                    },
                    {
                        rel: 'enroll',
                        method: 'post',
                        href: 'http://localhost:3100/v0/factors'
                    }
                ]
            }, {
                type: 'OneTimeToken',
                provider: 'OKTA',
                _links: [
                    {
                        rel: 'enroll',
                        method: 'post',
                        href: 'http://localhost:3100/v0/factors'
                    }
                ]
            }, {
                type: 'SMS',
                provider: 'OKTA',
                _links: [
                    {
                        rel: 'enroll',
                        method: 'post',
                        href: 'http://localhost:3100/v0/factors'
                    }
                ]
            }]
        }
    };

    return JSON.stringify(response);
}
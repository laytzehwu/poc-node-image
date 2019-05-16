var moment = require('moment');

module.exports = function () {
    var expiry = moment().add(3, 'm');
    var response = {
        status: 'MFA_ENROLL_ACTIVATION_REQUIRED',
        multifactor: {
            state: {
                token: '00R118CwpGl1R9u2LchaP0Jt5QSUtY-Vh_ck3HWrzU',
                expiry: expiry.toISOString()
            },
            factors: [{
                type: 'OneTimeToken',
                provider: 'OKTA',
                _links: [
                    {
                        rel: 'qrcode',
                        method: 'get',
                        href: 'assets/images/okta-verify-app.png'
                    },
                    {
                        rel: 'activate',
                        method: 'post',
                        href: 'http://localhost:3100/v0/factors/uftbnvjjtjFTaEN200h7/activate'
                    }
                ]
            }]
        }
    };

    return JSON.stringify(response);
}
const DEV_SAAS_PORTAL_URL = 'http://localhost:3200';

const APIGEE_ENABLED = false;

const envData = {
    COOKIE_DOMAIN: 'localhost',
    REDIRECT_AFTER_SUCCESSFUL_LOGIN_URL: DEV_SAAS_PORTAL_URL,
    SAAS_PORTAL_SVC_URL: 'http://localhost:3100',
    TOKEN_SVC_URL: 'http://localhost:3100',
    APIGEE_ENABLED: false,
    APIGEE_CONFIG: {
        CLIENT_ID: '18CSp3b9qzcfNgeL6djNQfhDwFU129HD',
        CLIENT_SECRET: 'jO8KayRsaoCV7rtH',
        EXP_SYSTEM_INFO: 'PCO',
    },
};

const apigeeEnvData = {
    COOKIE_DOMAIN: 'localhost',
    REDIRECT_AFTER_SUCCESSFUL_LOGIN_URL: DEV_SAAS_PORTAL_URL,
    SAAS_PORTAL_SVC_URL: 'http://localhost:3100',
    TOKEN_SVC_URL: 'http://localhost:3100/auth/experianone/v1',
    APIGEE_ENABLED: true,
    APIGEE_CONFIG: {
        CLIENT_ID: '18CSp3b9qzcfNgeL6djNQfhDwFU129HD',
        CLIENT_SECRET: 'jO8KayRsaoCV7rtH',
        EXP_SYSTEM_INFO: 'PCO',
    },
};

function getConfig() {
    return APIGEE_ENABLED ? apigeeEnvData : envData;
}

module.exports = {
    getConfig
};

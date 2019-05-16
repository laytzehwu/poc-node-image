const usersRepository = require('../repository/users-repository');
const HttpStatus = require('../utils/http').HttpStatus;
const ApigeeBaseError = require('../utils/apigee-error');
const BaseError = require('../utils/error');
const Token = require('../utils/token');
const AuthUtils = require('../utils/auth');
const state = require('../state');
const envvarsRepository = require('../repository/envvars-repository');

const mfaEnrolRequired = require('../mock-responses/mfa-enrol-required');
const mfaVerficationRequired = require('../mock-responses/mfa-verification-required');

const apigeeMfaEnrolRequired = require('../mock-responses/apigee-mfa-enrol-required');
const apigeeMfaVerficationRequired = require('../mock-responses/apigee-mfa-verification-required');

function createToken(req, res) {
    let authorisationHeader = req.get('Authorization');
    let encodedCredentials = authorisationHeader.replace(/^Basic /g, '');
    let credentials = new Buffer(encodedCredentials, 'base64').toString().split(':');
    let username = credentials[0];
    let password = credentials[1];

    let user = usersRepository.authenticate(username, password);

    if (user) {
        state.setCurrentUser(user);

        if (isMfaRequiredFor(user)) {
            res.type('json');
            if (isEnrolmentRequiredFor(user)) {
                res.status(HttpStatus.OK).write(mfaEnrolRequired());
            } else {
                res.status(HttpStatus.OK).write(mfaVerficationRequired());
            }
            res.end();
        } else {
            const token = Token.generate(user);
            state.setCurrentToken(token);
            const response = {
                status: 'SUCCESS',
                token: token
            };
            AuthUtils.addAuthCookie(res, token);
            res.status(HttpStatus.OK).json(response);
        }
    } else {
        res.setHeader('WWW-Authenticate', AuthUtils.createWwwAuthHeader(req));
        res.status(HttpStatus.UNAUTHORIZED).json(
            new BaseError(HttpStatus.UNAUTHORIZED, req.path, 'The username or password you have provided are incorrect. Please try again.')
        );
    }
}

function createApigeeToken(req, res) {
    const config = envvarsRepository.getConfig().APIGEE_CONFIG;
    const client_id = req.body['client_id'];
    const client_secret = req.body['client_secret'];
    const username = req.body['username'];
    const password = req.body['password'];
    const expSystemInfo = req.get('Exp-system-info');
    let authenticated = false;
    if (config.CLIENT_ID === client_id &&
        config.CLIENT_SECRET === client_secret &&
        config.EXP_SYSTEM_INFO === expSystemInfo) {
        let user = usersRepository.authenticate(username, password);
        if (user) {
            authenticated = true;
            state.setCurrentUser(user);
            if (isMfaRequiredFor(user)) {
                apigeeMfaVerificationOrActivation(user, res);
            } else {
                const token = Token.apigeeGenerate(user);
                state.setCurrentToken(token);
                AuthUtils.addAuthCookie(res, token);
                res.status(HttpStatus.OK).json(token);
                res.end();
            }
        }
    }

    if (!authenticated) {
        res.status(HttpStatus.UNAUTHORIZED).json(
            new ApigeeBaseError('Authentication failed', 'The username or password you have provided are incorrect. Please try again.')
        );
        res.end();
    }
}

function apigeeMfaVerificationOrActivation(user, res) {
    if (isEnrolmentRequiredFor(user)) {
        res.status(HttpStatus.OK).json(apigeeMfaEnrolRequired());
    } else {
        res.status(HttpStatus.OK).json(apigeeMfaVerficationRequired());
    }
    res.end();
}


function refreshToken(req, res) {
    const refreshToken = req.cookies['exp_rt'];
    if (refreshToken === state.getCurrentToken().refresh_token) {
        const token = Token.generate(state.getCurrentUser());
        state.setCurrentToken(token);
        AuthUtils.addAuthCookie(res, token);
        res.status(HttpStatus.OK).json(token);
    } else {
        res.setHeader('WWW-Authenticate', AuthUtils.createWwwAuthHeader(req));
        res.status(HttpStatus.UNAUTHORIZED).json(
            new BaseError(HttpStatus.UNAUTHORIZED, req.path, 'Credentials are invalid')
        );
    }
}

function logout(req, res) {
    const refreshToken = req.cookies['exp_rt'];

    if (refreshToken) {
        if (refreshToken === state.getCurrentToken().refresh_token) {
            console.log(`Valid refresh token: '${refreshToken}'; logging out`);
        } else {
            console.warn(`Invalid refresh token: '${refreshToken}'; still logging out`);
        }
        state.setCurrentUser(null);
        state.setCurrentToken(null);
        AuthUtils.addExpiredAuthCookie(res);
        res.status(HttpStatus.NO_CONTENT).end();
    } else {
        res.setHeader('WWW-Authenticate', AuthUtils.createWwwAuthHeader(req));
        res.status(HttpStatus.UNAUTHORIZED).json(
            new BaseError(HttpStatus.UNAUTHORIZED, req.path, 'Credentials are invalid')
        );
    }
}

function logoutApigee(req, res) {
    const config = envvarsRepository.getConfig().APIGEE_CONFIG;
    const expSystemInfo = req.get('Exp-system-info');
    const refreshToken = req.cookies['exp_rt'];
    const clientId = req.body['client_id'];
    const client_secret = req.body['client_secret'];

    const token = state.getCurrentToken();
    let success = false;

    if (token) {
        if (expSystemInfo === config.EXP_SYSTEM_INFO &&
            refreshToken === token.refresh_token &&
            clientId === config.CLIENT_ID &&
            client_secret === config.CLIENT_SECRET
        ) {
            success = true;
            state.setCurrentUser(null);
            state.setCurrentToken(null);
            AuthUtils.addExpiredAuthCookie(res);
            res.status(HttpStatus.NO_CONTENT).end();
        }
    }

    if (!success) {
        res.status(HttpStatus.UNAUTHORIZED).json(
            new BaseError(HttpStatus.UNAUTHORIZED, req.path, 'Credentials are invalid')
        );
    }
}

function isEnrolmentRequiredFor(user) {
    return user.username === 'enrolment@example.com';
}

function isMfaRequiredFor(user) {
    return user.username === 'enrolment@example.com' ||
        user.username === 'verification@example.com';
}

module.exports = {
    createToken,
    refreshToken,
    logout,
    createApigeeToken,
    logoutApigee,
};

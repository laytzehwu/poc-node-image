const HttpStatus = require('../utils/http').HttpStatus;
const Token = require('../utils/token');
const usersRepository = require('../repository/users-repository');
const ApigeeBaseError = require('../utils/apigee-error');
const BaseError = require('../utils/error');
const AuthUtils = require('../utils/auth');

const mfaEnrolActivationRequired = require('../mock-responses/mfa-enrol-activation-required');
const apigeeMfaEnrolActivationRequired = require('../mock-responses/apigee-mfa-enrol-activation-required');

function enrol(req, res) {
    res.type('json');
    res.status(HttpStatus.OK).write(mfaEnrolActivationRequired());
    res.end();
}

function apigeeEnrol(req, res) {
    res.status(HttpStatus.OK).json(apigeeMfaEnrolActivationRequired());
    res.end();
}

function activate(req, res) {
    const user = userToActivate();
    checkPassCode(req, user, res);
    res.end();
}

function apigeeActivate(req, res) {
    const user = userToActivate();
    checkApigeePassCode(user, res, req);
    res.end();
}

function verify(req, res) {
    const user = userToVerify();
    checkPassCode(req, user, res);
    res.end();
}

function apigeeVerify(req, res) {
    const user = userToVerify();
    checkApigeePassCode(user, res, req);
    res.end();
}

function userToActivate() {
    return usersRepository.findByEmail('enrolment@example.com');
}

function userToVerify() {
    return usersRepository.findByEmail('verification@example.com');
}

function checkPassCode(req, user, res) {
    const passCode = req.body['passCode'];
    if (passCode === user.passCode) {
        const token = Token.generate(user);
        let response = {
            status: 'SUCCESS',
            token: token
        };
        AuthUtils.addAuthCookie(res, token);
        res.status(HttpStatus.OK).json(response);
    } else {
        res.status(HttpStatus.UNAUTHORIZED).json(
            new BaseError(HttpStatus.UNAUTHORIZED, req.path, 'Invalid PassCode/Answer')
        );
    }
}

function checkApigeePassCode(user, res, req) {
    const passCode = req.body['passCode'];
    if (passCode === user.passCode) {
        const token = Token.apigeeGenerate(user);
        AuthUtils.addAuthCookie(res, token);
        res.status(HttpStatus.OK).json(token);
    } else {
        res.status(HttpStatus.UNAUTHORIZED).json(
            new ApigeeBaseError('Invalid Passcode/Answer', 'The passcode or answer you have provided are incorrect. Please try again.')
        );
    }
}

module.exports = {
    enrol,
    activate,
    verify,
    apigeeEnrol,
    apigeeActivate,
    apigeeVerify
};
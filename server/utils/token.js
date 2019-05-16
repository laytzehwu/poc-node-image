const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const secret = 'SHHH';
const tokenType = 'Bearer';
const refreshTokenType = 'Refresh';
const jwtHeader = {
    kid: uuidv4()
};
const jwtPayload = {
    audience: 'saas',
    issuer: 'token-service',
    expiresIn: 10800
};
const tokenRegExp = new RegExp(`^${tokenType} `, 'g');
const refreshTokenRegExp = new RegExp(`^${refreshTokenType} `, 'g');

function getAccessToken(user) {
    return jwt.sign(
        {
            sub: user.username,
            nbf: new Date().valueOf() / 1000 | 0,
            jti: uuidv4(),
            username: user.username,
            roles: user.roles
        },
        secret,
        {
            expiresIn: jwtPayload.expiresIn,
            audience: jwtPayload.audience,
            issuer: jwtPayload.issuer,
            header: jwtHeader
        }
    );
}

function generate(user) {
    const accessToken = getAccessToken(user);
    const decrypted = decrypt(accessToken);
    const refreshToken = uuidv4();

    return {
        token_type: tokenType,
        refresh_token_type: refreshTokenType,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: jwtPayload.expiresIn,
        issued_at: decrypted.iat,
    }
}

function apigeeGenerate(user) {
    const accessToken = getAccessToken(user);
    const decrypted = decrypt(accessToken);
    const refreshToken = uuidv4();

    return {
        token_type: tokenType,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: jwtPayload.expiresIn,
        issued_at: decrypted.iat,
    }
}

function decrypt(token) {
    return jwt.decode(token);
}

module.exports = {
    generate,
    tokenType,
    refreshTokenType,
    decrypt,
    tokenRegExp,
    refreshTokenRegExp,
    apigeeGenerate
};
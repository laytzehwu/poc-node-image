const Token = require('./token');
const HATEOAS = require('./hateoas');
const state = require('../state');

const whiteListedUrls = [
    /\/auth\/v0\/$/g,
    /\/envvars$/g,
    /\/reset$/g,
    /\/tokens\/create$/g,
    /\/tokens\/refresh$/g,
    /\/tokens\/logout/g,
    /\/factors/g,
    /^\/(?!v0\/).*/g // Whitelist all non API related URLs
];

function getTokenFromRequest(request) {
    return request.cookies['exp_at'];
}

function isUnprotected(url) {
    return whiteListedUrls.some(whiteListedUrl => url.match(whiteListedUrl) !== null);
}

function isAuthenticated(request) {
    const token = getTokenFromRequest(request);
    const decryptedToken = Token.decrypt(token);
    const hasValidAccessToken = state.hasCurrentUser() && decryptedToken !== null && decryptedToken.username === state.getCurrentUser().username;
    return token && hasValidAccessToken;
}

function isXSRFValid(request) {
    const token = getTokenFromRequest(request);
    const decryptedToken = Token.decrypt(token);
    const hasValidXSRFToken = request.get('X-XSRF-TOKEN') === decryptedToken.jti;
    return token && hasValidXSRFToken;
}

function createWwwAuthHeader(req) {
    return `Bearer realm="Outer space mock API", authn="${HATEOAS.getUrlPrefix(req)}/login"`;
}

function addAuthCookie(res, token) {
    const decrypted = Token.decrypt(token.access_token);
    res.cookie('exp_at', token.access_token, { path: '/', httpOnly: true });
    res.cookie('exp_rt', token.refresh_token, { path: '/', httpOnly: true });
    res.cookie('expires_in', (decrypted.exp - decrypted.iat), { path: '/' });
    res.cookie('issued_at', decrypted.iat, { path: '/' });
    res.cookie('issuer', decrypted.iss, { path: '/' });
    res.cookie('XSRF-TOKEN', decrypted.jti, { path: '/' });
}

function addExpiredAuthCookie(res) {
    const yesterday = new Date(); // Today!
    yesterday.setUTCDate(yesterday.getUTCDate() - 1); // Yesterday in UTC
    res.cookie('exp_at', '', { path: '/', httpOnly: true, expires: yesterday });
    res.cookie('exp_rt', '', { path: '/', httpOnly: true, expires: yesterday });
    res.cookie('expires_in', '', { path: '/', expires: yesterday });
    res.cookie('issued_at', '', { path: '/', expires: yesterday });
    res.cookie('issuer', '', { path: '/', expires: yesterday });
}

module.exports = {
    isUnprotected,
    isAuthenticated,
    isXSRFValid,
    createWwwAuthHeader,
    addAuthCookie,
    addExpiredAuthCookie,
};

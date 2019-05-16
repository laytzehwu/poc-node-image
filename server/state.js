let currentUser = null;
let currentToken = null;

function getCurrentUser() {
    return currentUser;
}

function getCurrentToken() {
    return currentToken;
}

function setCurrentUser(value) {
    currentUser = value;
}

function setCurrentToken(value) {
    currentToken = value;
}

function hasCurrentToken() {
    return currentToken !== null;
}

function hasCurrentUser() {
    return currentUser !== null;
}

module.exports = {
    getCurrentUser,
    setCurrentUser,
    hasCurrentUser,
    getCurrentToken,
    setCurrentToken,
    hasCurrentToken
}
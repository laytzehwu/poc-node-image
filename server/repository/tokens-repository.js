const Logger = require('../utils/logger');
const uuidv4 = require('uuid/v4');

const mockedData = [
    {
        token: '123456789',
        email: 'john.doe@example.com'
    }
];
let tokens = [];

function reset () {
    Logger.info('Resetting tokens...');
    tokens.length = 0;
    mockedData.forEach((item) => {
        let clonedToken = JSON.parse(JSON.stringify(item));
        tokens.push(clonedToken);
    });
}

function findOne (key) {
    let token = tokens.find((token) => {
        return token.token === key;
    });

    if (!token) {
        Logger.error(`Invalid token '${key}'`);
    }

    return token;
}

function deleteByEmail (email) {
    tokens = tokens.filter((token) => {
        if (token.email !== email) {
            return true;
        } else {
            Logger.info(`Removing old token ${token.token} for ${email}`);
            return false;
        }
    });
}

function save (email) {
    deleteByEmail(email);
    const token = uuidv4();
    tokens = [...tokens, {
        token,
        email
    }];
    Logger.info(`Token ${token} has been generated for ${email}`);
}

reset();

module.exports = {
    reset,
    findOne,
    save,
    deleteByEmail
};
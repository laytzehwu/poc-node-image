const Logger = require('../utils/logger');

const CLIENT_SYSTEM_ADMIN = 'CLIENT_SYSTEM_ADMIN';
const CLIENT_USER = 'CLIENT_USER';
const CLIENT_BI_USER = 'CLIENT_BI_USER';

const mockedData = [
    {
        username: 'admin@example.com',
        password: 'admin',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        roles: [
            CLIENT_SYSTEM_ADMIN,
            CLIENT_USER,
            CLIENT_BI_USER,
        ]
    },
    {
        username: 'client@example.com',
        password: 'client',
        firstName: 'Norm',
        lastName: 'Client',
        email: 'client@example.com',
        roles: [
            CLIENT_USER,
        ]
    },
    {
        username: 'bi@example.com',
        password: 'bi',
        firstName: 'Business',
        lastName: 'Intelligence',
        email: 'bi@example.com',
        roles: [
            CLIENT_BI_USER,
        ]
    },
    {
        username: 'simple@example.com',
        password: 'simple',
        firstName: 'Simple',
        lastName: 'Account',
        email: 'simple@example.com',
        roles: [
            CLIENT_USER,
            CLIENT_BI_USER,
        ]
    },
    {
        username: 'enrolment@example.com',
        password: 'enrolment',
        firstName: 'Requires',
        lastName: 'Enrolment',
        email: 'enrolment@example.com',
        roles: [
            CLIENT_USER,
            CLIENT_BI_USER,
        ],
        passCode: '123456'
    },
    {
        username: 'verification@example.com',
        password: 'verification',
        firstName: 'Requires',
        lastName: 'Verification',
        email: 'verification@example.com',
        roles: [
            CLIENT_USER,
            CLIENT_BI_USER,
        ],
        passCode: '123456'
    },
    {
        username: 'special@example.com',
        password: 'Пассворд123',
        firstName: 'Mother',
        lastName: 'Russia',
        email: 'Mother.russia@example.com',
        roles: [
            CLIENT_SYSTEM_ADMIN,
            CLIENT_USER,
            CLIENT_BI_USER,
        ]
    }
];
let users = [];

function reset() {
    Logger.info('Resetting users...');
    users.length = 0;
    mockedData.forEach((item) => {
        let clonedUser = JSON.parse(JSON.stringify(item));
        users.push(clonedUser);
    });
}

function findOne(username) {
    const user = users.find((user) => user.username === username);

    if (!user) {
        Logger.error(`No user exists with username '${username}'`);
    }

    return user;
}

function findByEmail(email) {
    let user = users.find((user) => user.email === email);

    if (!user) {
        Logger.error(`No user exists with e-mail address '${email}'`);
    }

    return user;
}

function authenticate(username, password) {
    let user = findOne(username);

    if (user) {
        if (user.password === password) {
            user = Object.assign({}, user);
            delete user.password;
        } else {
            Logger.error(`Wrong password provided for user with username '${user.username}'`);
            user = null;
        }
    }

    return user;
}

function checkPassword(username, password) {
    const user = findOne(username);

    return user !== undefined && user.password === password;
}

function setPassword(username, password) {
    const user = findOne(username);

    if (user) {
        user.password = password;
    }
}

reset();

module.exports = {
    authenticate,
    findByEmail,
    checkPassword,
    setPassword,
    reset,
    findOne
};
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const {
    tokensRoute,
    userRoute,
    envvarsRoute,
    factorsRoute,
    resetRoute,
    apigeeTokensRoute,
    apigeeFactorsRoute,
    homeUrlRoute,
    preferencesRoute,
} = require('./endpoints');
const HttpStatus = require('./utils/http').HttpStatus;
const BaseError = require('./utils/error');
const AuthUtils = require('./utils/auth');
const state = require('./state');

const tokensRouter = require('./routes/tokens-router');
const userRouter = require('./routes/user-router');
const envvarsRouter = require('./routes/envvars-router');
const factorsRouter = require('./routes/factors-router');
const apigeeTokensRouter = require('./routes/apigee-router');
const apigeeFactorsRouter = require('./routes/apigee-factors-router');
const homeUrlRouter = require('./routes/homeurl-router');
const preferencesRouter = require('./routes/preferences-router');

const usersRepository = require('./repository/users-repository');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require("path");

module.exports = (PORT) => {
    if (!PORT) {
        throw new Error('PORT must be defined');
    }
    const app = express();

    const corsOptions = {
        origin: (origin, callback) => {
            console.log(`SaaS Assets: CORS: origin: ${origin}`);
            callback(null, true);
        },
        credentials: true,
    };

    app.use(morgan('dev'));
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.experian+json' }));

    // Request interceptor
    app.use((req, res, next) => {
        // Set default repsonse headers
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');

        // Handle JWT
        if (AuthUtils.isUnprotected(req.path)) {
            next();
        } else if (!AuthUtils.isAuthenticated(req)) {
            state.setCurrentUser(null);
            res.setHeader('WWW-Authenticate', AuthUtils.createWwwAuthHeader(req));
            res.status(HttpStatus.UNAUTHORIZED).json(
                new BaseError(HttpStatus.UNAUTHORIZED, req.path, 'Authentication Failure')
            );
        }
        // else if (!AuthUtils.isXSRFValid(req)) {
        //     state.setCurrentUser(null);
        //     res.status(HttpStatus.FORBIDDEN).json(
        //         new BaseError(HttpStatus.FORBIDDEN, req.path, 'Invalid or missing XSRF token')
        //     );
        // }
        else {
            next();
        }
    });

    // Set up routers
    app.use(apigeeTokensRoute.getUrl(), apigeeTokensRouter);
    app.use(tokensRoute.getUrl(), tokensRouter);
    app.use(userRoute.getUrl(), userRouter);
    app.use(envvarsRoute.getUrl(), envvarsRouter);
    app.use(factorsRoute.getUrl(), factorsRouter);
    app.use(apigeeFactorsRoute.getUrl(), apigeeFactorsRouter);
    app.use(homeUrlRoute.getUrl(), homeUrlRouter);
    app.use(preferencesRoute.getUrl(), preferencesRouter);

    app.get('/homePage', (req, res) => {
        res.sendFile(path.join(__dirname + '/page/home.html'));
    });

    app.post(resetRoute.getUrl(), (req, res) => {
        usersRepository.reset();
        res.status(HttpStatus.NO_CONTENT).end();
    });

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend server is running at http://0.0.0.0:${PORT}`);
    });
};

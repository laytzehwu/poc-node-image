const Router = require('express').Router;

const tokensApi = require('../api/tokens-api');
const { 
    apigeeTokensRoute,
    apigeeTokensCreateRoute,
    apigeeTokensLogoutRoute,
} = require('../endpoints');

const apigeeTokensRouter = new Router();

apigeeTokensRouter.post(apigeeTokensLogoutRoute.getRootRelativeUrl(apigeeTokensRoute), tokensApi.logoutApigee);
apigeeTokensRouter.post(apigeeTokensCreateRoute.getRootRelativeUrl(apigeeTokensRoute), tokensApi.createApigeeToken);
module.exports = apigeeTokensRouter;

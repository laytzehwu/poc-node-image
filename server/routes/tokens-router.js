const Router = require('express').Router;

const tokensApi = require('../api/tokens-api');
const { 
    tokensRoute,
    tokensCreateRoute, 
    tokensRefreshRoute,
    logoutRoute
} = require('../endpoints');

const tokensRouter = new Router();

tokensRouter.post(tokensCreateRoute.getRootRelativeUrl(tokensRoute), tokensApi.createToken);
tokensRouter.post(tokensRefreshRoute.getRootRelativeUrl(tokensRoute), tokensApi.refreshToken);
tokensRouter.post(logoutRoute.getRootRelativeUrl(tokensRoute), tokensApi.logout);

module.exports = tokensRouter;
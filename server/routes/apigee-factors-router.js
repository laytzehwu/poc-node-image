const Router = require('express').Router;

const factorsApi = require('../api/factors-api');
const {
    apigeeFactorsRoute,
    apigeeFactorsActivateRoute,
    apigeeFactorsVerifyRoute
} = require('../endpoints');

const factorsRouter = new Router();

factorsRouter.post(apigeeFactorsRoute.getSlash(), factorsApi.apigeeEnrol);
factorsRouter.post(apigeeFactorsActivateRoute.getRootRelativeUrl(apigeeFactorsRoute), factorsApi.apigeeActivate);
factorsRouter.post(apigeeFactorsVerifyRoute.getRootRelativeUrl(apigeeFactorsRoute), factorsApi.apigeeVerify);
module.exports = factorsRouter;
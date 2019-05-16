const Router = require('express').Router;

const factorsApi = require('../api/factors-api');
const {
    factorsRoute,
    factorsActivateRoute,
    factorsVerifyRoute
} = require('../endpoints');

const factorsRouter = new Router();

factorsRouter.post(factorsRoute.getSlash(), factorsApi.enrol);
factorsRouter.post(factorsActivateRoute.getRootRelativeUrl(factorsRoute), factorsApi.activate);
factorsRouter.post(factorsVerifyRoute.getRootRelativeUrl(factorsRoute), factorsApi.verify);
module.exports = factorsRouter;
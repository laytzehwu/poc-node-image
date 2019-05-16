const Router = require('express').Router;

const envvarsApi = require('../api/envvars-api');
const {
    envvarsRoute
} = require('../endpoints');

const envvarsRouter = new Router();

envvarsRouter.get(envvarsRoute.getSlash(), envvarsApi.getEnvironmentVariables);

module.exports = envvarsRouter;

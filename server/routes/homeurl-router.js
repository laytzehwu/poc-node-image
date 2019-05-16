const Router = require('express').Router;

const homeUrlApi = require('../api/homeurl-api');
const {
    homeUrlRoute,        
} = require('../endpoints');

const homeUrlRouter = new Router();

homeUrlRouter.get(homeUrlRoute.getSlash(), homeUrlApi.getHomeLandingUrl);

module.exports = homeUrlRouter;
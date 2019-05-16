const Router = require('express').Router;

const preferencesApi = require('../api/preferences-api');
const { preferencesRoute } = require('../endpoints');

const preferenceUrlRouter = new Router();

preferenceUrlRouter.get(preferencesRoute.getSlash(), preferencesApi.getPreferences);

module.exports = preferenceUrlRouter;

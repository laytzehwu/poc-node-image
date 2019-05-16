const Router = require('express').Router;

const userApi = require('../api/user-api');
const {
    userRoute,
} = require('../endpoints');

const userRouter = new Router();

userRouter.get(userRoute.getSlash(), userApi.getCurrentUser);

module.exports = userRouter;
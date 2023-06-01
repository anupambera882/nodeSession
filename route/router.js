const express = require('express');
const route = express.Router();
const Controller = require('../controller/controller');

route.get("/",Controller.getIndex);
route.get("/create-account", Controller.getCreateAccountIndex);
route.post("/create-account", Controller.createNewAccount);
route.get('/login', Controller.getLogin);
route.post('/login', Controller.UserLogin);
route.get("/update-profile", Controller.getUpdateProfile);
route.post("/update-profile", Controller.changePassword);
route.get('/logout', Controller.LogoutUserAccount);
route.get('/deleteAccount', Controller.deleteUserAccount);
route.get('/forgot-password', Controller.getForgotPasswordIndex);
route.post('/forgot-password', Controller.forgotPassword);
route.get("/profile",Controller.getUserDetailsById)

module.exports = route;
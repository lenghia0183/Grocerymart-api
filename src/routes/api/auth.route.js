const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { authController } = require('../../controllers');
const { authValidation } = require('../../validations');
const authRouter = express.Router();

authRouter.route('/login').post(validate(authValidation.login), authController.login);
authRouter.route('/social-login').post(validate(authValidation.socialLogin), authController.socialLogin);

authRouter.route('/register').post(validate(authValidation.register), authController.register);

authRouter.route('/refresh-token').post(validate(authValidation.refreshToken), authController.refreshToken);

module.exports = authRouter;

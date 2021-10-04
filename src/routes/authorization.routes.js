const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const {
    signInController,
    signOutController,
    signUpController,
    forgotPasswordController,
    resetPasswordController
} = require('../controllers/authorization.controller');
const ApiUtils = require('../api/api.router');
const { validateResult } = require('../validation/base');
const { 
    validateAuthRules,
    validateSignUpRules,
    validateRefreshAuthRules,
    validateForgotPasswordRules,
    validateResetPasswordRules
 } = require('../validation/authorization.validator');

exports.routesConfig = function (app) {
    /**
      * @swagger
      * /auth:
      *   post:
      *     tags:
      *       - Auth
      *     produces:
      *       - application/json
      *     parameters:
      *     - name: body
      *       in: body
      *       description: Sign in using email and password
      *       required: true
      *       schema:
      *         type: object
      *         required:
      *           - email
      *           - password
      *         properties:
      *           email:
      *             type: string
      *           password:
      *             type: string
      *     responses:
      *       200:
      *         description: Sign in successful
      */
    app.post(ApiUtils.AUTH, [
        validateAuthRules(),
        validateResult,
        signInController,
    ]);

    /**
      * @swagger
      * /signup:
      *   post:
      *     tags:
      *       - Auth
      *     produces:
      *       - application/json
      *     parameters:
      *     - name: body
      *       in: body
      *       description: Sign up using email, firstName, lastName, password
      *       required: true
      *       schema:
      *         type: object
      *         required:
      *           - email
      *           - firstName
      *           - lastName
      *           - password
      *         properties:
      *           email:
      *             type: string
      *           firstName:
      *             type: string
      *           lastName:
      *             type: string
      *           password:
      *             type: string
      *     responses:
      *       201:
      *         description: Sign up successful
      */
    app.post(ApiUtils.SIGN_UP, [
        validateSignUpRules(),
        validateResult,
        signUpController,
    ]);

    app.post(ApiUtils.AUTH_REFRESH, [
        validateRefreshAuthRules(),
        validateResult,
        VerifyUserMiddleware.validJWTNeeded,
        VerifyUserMiddleware.validRefreshNeeded,
        signInController,
    ]);

    app.post(ApiUtils.SIGN_OUT, [
        signOutController,
    ]);

    app.post(ApiUtils.FORGOT_PASSWORD, [
        validateForgotPasswordRules(),
        validateResult,
        forgotPasswordController,
    ]);

    app.post(ApiUtils.RESET_PASSWORD, [
        validateResetPasswordRules(),
        validateResult,
        resetPasswordController,
    ]);
};
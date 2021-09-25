const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const {
    signInController,
    signOutController,
    signUpController
} = require('../controllers/authorization.controller');
const ApiUtils = require('../api/api.router');
const { validateResult } = require('../validation/base');
const { 
    validateAuthRules,
    validateSignUpRules,
    validateRefreshAuthRules
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

    /**
     * @swagger
     * /auth/refresh:
     *   post:
     *     tags:
     *       - Auth
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: body
     *       in: body
     *       description: Get new token using refresh token
     *       required: true
     *       schema:
     *         type: object
     *         required:
     *           - refreshToken
     *         properties:
     *           refreshToken:
     *             type: string
     *     responses:
     *       200:
     *         description: Refresh token successful
     */
    app.post(ApiUtils.AUTH_REFRESH, [
        validateRefreshAuthRules(),
        validateResult,
        VerifyUserMiddleware.validJWTNeeded,
        VerifyUserMiddleware.validRefreshNeeded,
        signInController,
    ]);

    /**
      * @swagger
      * /signout:
      *   post:
      *     tags:
      *       - Auth
      *     produces:
      *       - application/json
      *     parameters:
      *     - name: fcmToken
      *       in: header
      *       description: fire base cloud messaging token
      *       required: true
      *       type: string
      *     responses:
      *       200:
      *         description: Sign out successful
      */
    app.post(ApiUtils.SIGN_OUT, [
        signOutController,
    ]);
};
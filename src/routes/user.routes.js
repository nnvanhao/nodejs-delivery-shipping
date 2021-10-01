const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const {
    getUsersController,
    getUserByIdController,
    updateUserController
} = require('../controllers/user.controller');
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
    app.get(ApiUtils.GET_USERS, [
        VerifyUserMiddleware.validJWTNeeded,
        getUsersController,
    ]);

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
     app.get(ApiUtils.GET_USER, [
        VerifyUserMiddleware.validJWTNeeded,
        getUserByIdController,
    ]);

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
     app.put(ApiUtils.UPDATE_USER, [
        VerifyUserMiddleware.validJWTNeeded,
        updateUserController,
    ]);

};
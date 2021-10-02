const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const {
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController
} = require('../controllers/user.controller');
const ApiUtils = require('../api/api.router');
const { validateResult } = require('../validation/base');
const { 
    validateAuthRules,
    validateSignUpRules,
    validateRefreshAuthRules
 } = require('../validation/authorization.validator');

exports.routesConfig = function (app) {

    app.get(ApiUtils.GET_USERS, [
        VerifyUserMiddleware.validJWTNeeded,
        getUsersController,
    ]);

     app.get(ApiUtils.GET_USER, [
        VerifyUserMiddleware.validJWTNeeded,
        getUserByIdController,
    ]);

     app.put(ApiUtils.UPDATE_USER, [
        VerifyUserMiddleware.validJWTNeeded,
        updateUserController,
    ]);

     app.delete(ApiUtils.GET_USER, [
        VerifyUserMiddleware.validJWTNeeded,
        deleteUserController,
    ]);
};
const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const VerifyPermissionMiddleware = require('../middlewares/verify.permission.middleware');
const {
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    createUserByIdController
} = require('../controllers/user.controller');
const ApiUtils = require('../api/api.router');
const { validateResult } = require('../validation/base');
const {
    validateCreateUserRules
} = require('../validation/authorization.validator');
const { ROLE_TYPE } = require('../constants/common.constant');

exports.routesConfig = function (app) {

    app.get(ApiUtils.GET_USERS, [
        VerifyUserMiddleware.validJWTNeeded,
        getUsersController,
    ]);

    app.get(ApiUtils.GET_USER, [
        VerifyUserMiddleware.validJWTNeeded,
        getUserByIdController,
    ]);

    app.post(ApiUtils.CREATE_USER, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        validateCreateUserRules(),
        validateResult,
        createUserByIdController,
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
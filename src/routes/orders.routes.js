const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const VerifyPermissionMiddleware = require('../middlewares/verify.permission.middleware');
const {
    createOrdersController,
} = require('../controllers/orders.controller');
const ApiUtils = require('../api/api.router');
const { validateResult } = require('../validation/base');
const {
    validateCreateUserRules
} = require('../validation/authorization.validator');
const { ROLE_TYPE } = require('../constants/common.constant');

exports.routesConfig = function (app) {

    app.post(ApiUtils.CREATE_ORDERS_BY_PARTNER, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.CUSTOMER]),
        createOrdersController,
    ]);

};

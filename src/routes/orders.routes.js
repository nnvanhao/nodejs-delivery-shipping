const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const VerifyPermissionMiddleware = require('../middlewares/verify.permission.middleware');
const {
    createOrdersController,
    getOrdersController,
    getOrdersByIdController,
    updateOrdersController,
    deleteOrdersController,
    createOrdersEventController,
    getOrdersEventController,
    getOrdersStatusesController,
    createOrdersStatusController,
    updateOrdersStatusController,
    updateSortIndexOrdersStatusController
} = require('../controllers/orders.controller');
const ApiUtils = require('../api/api.router');
const { validateResult } = require('../validation/base');
const {
    validateCreateOrdersRules,
    validateCreateOrdersStatusRules
} = require('../validation/orders.validator');
const { ROLE_TYPE } = require('../constants/common.constant');

exports.routesConfig = function (app) {

    app.post(ApiUtils.CREATE_ORDERS_BY_PARTNER, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.CUSTOMER]),
        validateCreateOrdersRules(),
        validateResult,
        createOrdersController,
    ]);

    app.post(ApiUtils.CREATE_ORDERS_BY_OTHER, [
        validateCreateOrdersRules(),
        validateResult,
        createOrdersController,
    ]);

    app.get(ApiUtils.GET_ORDERS, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        getOrdersController,
    ]);

    app.get(ApiUtils.GET_ORDERS_BY_ID, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        getOrdersByIdController,
    ]);

    app.put(ApiUtils.UPDATE_ORDERS, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER]),
        validateCreateOrdersRules(),
        validateResult,
        updateOrdersController,
    ]);

    app.delete(ApiUtils.DELETE_ORDERS, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER]),
        deleteOrdersController,
    ]);

    app.post(ApiUtils.CREATE_ORDERS_EVENT, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER]),
        createOrdersEventController,
    ]);

    app.get(ApiUtils.GET_ORDERS_EVENT, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER]),
        getOrdersEventController,
    ]);

    app.get(ApiUtils.GET_ORDERS_STATUSES, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER]),
        getOrdersStatusesController,
    ]);

    app.post(ApiUtils.CREATE_ORDERS_STATUS, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        validateCreateOrdersStatusRules(),
        validateResult,
        createOrdersStatusController,
    ]);

    app.put(ApiUtils.UPDATE_ORDERS_STATUS, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        validateCreateOrdersStatusRules(),
        validateResult,
        updateOrdersStatusController,
    ]);

    app.put(ApiUtils.UPDATE_SORT_INDEX_ORDERS_STATUS, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        updateSortIndexOrdersStatusController,
    ]);

};

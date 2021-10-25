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
    getOrdersStatusByIdController,
    createOrdersStatusController,
    updateOrdersStatusController,
    updateSortIndexOrdersStatusController,
    deleteOrdersStatusController,
    getOrdersEventsByOrdersCodeController,
    getShippingFeeController
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
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER]),
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
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER, ROLE_TYPE.EMPLOYEE]),
        getOrdersController,
    ]);

    app.get(ApiUtils.GET_ORDERS_BY_ID, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER]),
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
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER, ROLE_TYPE.EMPLOYEE]),
        createOrdersEventController,
    ]);

    app.get(ApiUtils.GET_ORDERS_EVENT, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER]),
        getOrdersEventController,
    ]);

    app.get(ApiUtils.GET_ORDERS_EVENT_BY_ORDERS_CODE, [
        getOrdersEventsByOrdersCodeController,
    ]);

    app.get(ApiUtils.GET_ORDERS_STATUSES, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER, ROLE_TYPE.EMPLOYEE]),
        getOrdersStatusesController,
    ]);

    app.get(ApiUtils.ORDERS_STATUS_ID, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        getOrdersStatusByIdController,
    ]);

    app.post(ApiUtils.CREATE_ORDERS_STATUS, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        validateCreateOrdersStatusRules(),
        validateResult,
        createOrdersStatusController,
    ]);

    app.put(ApiUtils.ORDERS_STATUS_ID, [
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

    app.delete(ApiUtils.ORDERS_STATUS_ID, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        deleteOrdersStatusController,
    ]);

    app.get(ApiUtils.GET_SHIPPING_FEE, [
        getShippingFeeController,
    ]);

};

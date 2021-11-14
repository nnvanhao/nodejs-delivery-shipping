const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const VerifyPermissionMiddleware = require('../middlewares/verify.permission.middleware');
const {
    employeeReportController,
    customerReportController,
    ordersReportController
} = require('../controllers/report.controller');
const ApiUtils = require('../api/api.router');
const { ROLE_TYPE } = require('../constants/common.constant');

exports.routesConfig = function (app) {

    app.get(ApiUtils.GET_REPORTS_EMPLOYEE, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        employeeReportController,
    ]);

    app.get(ApiUtils.GET_REPORTS_CUSTOMER, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        customerReportController,
    ]);

    app.get(ApiUtils.GET_REPORTS_ORDERS, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        ordersReportController,
    ]);

};

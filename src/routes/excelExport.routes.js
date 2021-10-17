const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const VerifyPermissionMiddleware = require('../middlewares/verify.permission.middleware');
const {
    excelExportController,
} = require('../controllers/excelExport.controller');
const ApiUtils = require('../api/api.router');
const { ROLE_TYPE } = require('../constants/common.constant');

exports.routesConfig = function (app) {

    app.get(ApiUtils.EXCEL_EXPORT, [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.CUSTOMER, ROLE_TYPE.ADMIN]),
        excelExportController,
    ]);
};

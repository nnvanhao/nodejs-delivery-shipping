const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const VerifyPermissionMiddleware = require('../middlewares/verify.permission.middleware');
const {
    updateSettingsController,
    getSettingsController,
    getSettingByKeyController
} = require('../controllers/setting.controller');
const ApiUtils = require('../api/api.router');
const { ROLE_TYPE } = require('../constants/common.constant');

exports.routesConfig = function (app) {

    app.put(ApiUtils.UPDATE_SETTINGS,[
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN]),
        updateSettingsController,
    ]);

    app.get(ApiUtils.GET_SETTINGS,[
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER, ROLE_TYPE.EMPLOYEE]),
        getSettingsController,
    ]);

    app.get(ApiUtils.GET_SETTING_BY_KEY,[
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.ADMIN, ROLE_TYPE.CUSTOMER, ROLE_TYPE.EMPLOYEE]),
        getSettingByKeyController,
    ]);

};

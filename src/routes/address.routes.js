const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const {
    getProvincesController,
    getDistrictsByProvinceController,
    getWardsByDistrictController
} = require('../controllers/address.controller');
const ApiUtils = require('../api/api.router');

exports.routesConfig = function (app) {

    app.get(ApiUtils.GET_PROVINCES, [
        getProvincesController,
    ]);

     app.get(ApiUtils.GET_DISTRICTS_BY_PROVINCE, [
        getDistrictsByProvinceController,
    ]);

     app.get(ApiUtils.GET_WARDS_BY_DISTRICT, [
        getWardsByDistrictController,
    ]);

};

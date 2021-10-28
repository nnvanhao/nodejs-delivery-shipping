const VerifyUserMiddleware = require('../middlewares/verify.authenticate.middleware');
const VerifyPermissionMiddleware = require('../middlewares/verify.permission.middleware');
const {
    uploadFilesController,
} = require('../controllers/uploadFile.controller');
const ApiUtils = require('../api/api.router');
const { ROLE_TYPE } = require('../constants/common.constant');
const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

exports.routesConfig = function (app) {

    app.post(ApiUtils.UPLOAD_FILES,
        upload.array('uploadFiles'), [
        VerifyUserMiddleware.validJWTNeeded,
        VerifyPermissionMiddleware.permissionRequired([ROLE_TYPE.CUSTOMER, ROLE_TYPE.ADMIN, ROLE_TYPE.EMPLOYEE]),
        uploadFilesController,
    ]);
};

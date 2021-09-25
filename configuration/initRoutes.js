const { AuthorizationRoutes } = require('../src/routes');

exports.initRoutes = function (app) {
    AuthorizationRoutes.routesConfig(app);
};
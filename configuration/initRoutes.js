const { AuthorizationRoutes } = require('../src/routes');
const { UserRoutes } = require('../src/routes');

exports.initRoutes = function (app) {
    AuthorizationRoutes.routesConfig(app);
    UserRoutes.routesConfig(app);
};

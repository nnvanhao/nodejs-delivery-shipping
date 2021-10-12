const { AuthorizationRoutes } = require('../src/routes');
const { UserRoutes } = require('../src/routes');
const { AddressRoutes } = require('../src/routes');
const { OrdersRoutes } = require('../src/routes');

exports.initRoutes = function (app) {
    AuthorizationRoutes.routesConfig(app);
    UserRoutes.routesConfig(app);
    AddressRoutes.routesConfig(app);
    OrdersRoutes.routesConfig(app);
};

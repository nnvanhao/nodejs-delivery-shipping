//------Authorization------//
exports.AUTH = '/auth';
exports.AUTH_REFRESH = '/auth/refresh';
exports.SIGN_UP = '/signup';
exports.SIGN_OUT = '/signout';
exports.FORGOT_PASSWORD = '/forgotPassword';
exports.RESET_PASSWORD = '/resetPassword';
exports.CHANGE_PASSWORD = '/changePassword';

//------User------//
exports.GET_USERS = '/users';
exports.GET_USER = '/user/:id';
exports.UPDATE_USER = '/user/:id';
exports.CREATE_USER = '/user';
exports.ACTIVATE_USER = '/activateUser';

//------Adress------//
exports.GET_PROVINCES = '/provinces';
exports.GET_DISTRICTS_BY_PROVINCE = '/districtsByProvince/:id';
exports.GET_WARDS_BY_DISTRICT = '/wardsByDistrict/:id';

//------Orders------//
exports.CREATE_ORDERS_BY_PARTNER = '/orders/createByPartner';
exports.CREATE_ORDERS_BY_OTHER = '/orders/createByOther';
exports.GET_ORDERS = '/orders';
exports.GET_ORDERS_BY_ID = '/orders/:id';
exports.UPDATE_ORDERS = '/orders/:id';
exports.DELETE_ORDERS = '/orders/:id';
exports.CREATE_ORDERS_EVENT = '/orders/event';
exports.GET_ORDERS_EVENT = '/orders/:id/events';

//------export------//
exports.EXCEL_EXPORT = '/export';

//------Orders Status------//
exports.GET_ORDERS_STATUSES = '/ordersStatuses';
exports.CREATE_ORDERS_STATUS = '/ordersStatus';
exports.ORDERS_STATUS_ID = '/ordersStatus/:id';
exports.UPDATE_SORT_INDEX_ORDERS_STATUS = '/sortIndexOrdersStatuses';

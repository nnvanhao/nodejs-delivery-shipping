//------Authorization------//
exports.AUTH = '/auth';
exports.AUTH_REFRESH = '/auth/refresh';
exports.SIGN_UP = '/signup';
exports.SIGN_OUT = '/signout';

//------User------//
exports.GET_USERS = '/users';
exports.GET_USER = '/user/:id';

//------Adress------//
exports.GET_PROVINCES = '/provinces';
exports.GET_DISTRICTS_BY_PROVINCE = '/districtsByProvince/:id';
exports.GET_WARDS_BY_DISTRICT = '/wardsByDistrict/:id';

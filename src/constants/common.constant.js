const LOGGER_TYPE = {
    INFO: 'info',
    WARNING: 'warn',
    ERROR: 'error',
}

const ROLE_TYPE = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    EMPLOYEE: 'EMPLOYEE'
}

const CUSTOMER_TYPE = {
    PARTNER: 'PARTNER',
    OTHER: 'OTHER',
}

const USER_CODE = {
    KH: 'KH',
    NV: 'NV',
    ORDERS: 'ORDERS'
}

const USER_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    WAITING_VERIFY: 'Waiting_Verify'
}

const GENDER = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other'
}

const SHIPPING_FEE_PAYMENT = {
    SENDER_PAY: 'SenderPay',
    RECEIVER_PAY: 'ReceiverPay',
}

const SHIPPING_FEE_PAYMENT_TEXT = {
    SenderPay: 'Người gửi trả phí',
    ReceiverPay: 'Người nhận trả phí',
}

const ROLE_TYPE_LANG = {
    CUSTOMER: 'Khach_hang',
    EMPLOYEE: 'Nhan_vien',
    ORDERS: 'Don_hang',
    ORDERS_EVENTS: 'Su_kien_don_hang'
}

const EXPORT_TYPE = {
    USERS: 'USERS',
    ORDERS: 'ORDERS',
    ORDERS_EVENTS: 'ORDERS_EVENTS'
}

const GHTK_API_URL = 'https://services.giaohangtietkiem.vn/services/shipment/fee'

const FOLDER_DRIVER_NAME = {
    USERS: 'Users',
    ORDERS: 'Orders',
    VIVU_SHIP: 'ViVuShip',
    SETTINGS: 'Settings'
}

const SETTINGS_KEY = {
    BRAND_IMAGE: 'BRAND_IMAGE',
    BANNER_IMAGES: 'BANNER_IMAGES',
    AUTH_IMAGE: 'AUTH_IMAGES',
    ABOUT_US: 'ABOUT_US',
    SERVICES: 'SERVICES',
    CONTACT: 'CONTACT',
    POLICY: 'POLICY',
    TERMS_AND_CONDITIONS: 'TERMS_AND_CONDITIONS',
    SECURITY_AND_PRIVACY: 'SECURITY_AND_PRIVACY',
    SUPPORT: 'SUPPORT'
}

module.exports = {
    LOGGER_TYPE,
    ROLE_TYPE,
    CUSTOMER_TYPE,
    USER_CODE,
    USER_STATUS,
    GENDER,
    SHIPPING_FEE_PAYMENT,
    SHIPPING_FEE_PAYMENT_TEXT,
    ROLE_TYPE_LANG,
    EXPORT_TYPE,
    GHTK_API_URL,
    FOLDER_DRIVER_NAME,
    SETTINGS_KEY
};

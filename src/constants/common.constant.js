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
    GHTK_API_URL
};

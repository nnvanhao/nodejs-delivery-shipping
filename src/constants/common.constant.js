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
    ORDER: 'ORDER'
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

const ORDER_STATUS = {
}

module.exports = { 
    LOGGER_TYPE, 
    ROLE_TYPE, 
    CUSTOMER_TYPE, 
    USER_CODE, 
    USER_STATUS, 
    GENDER,
    SHIPPING_FEE_PAYMENT,
    SHIPPING_FEE_PAYMENT_TEXT
};

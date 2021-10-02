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

module.exports = { LOGGER_TYPE, ROLE_TYPE, CUSTOMER_TYPE, USER_CODE, USER_STATUS, GENDER };

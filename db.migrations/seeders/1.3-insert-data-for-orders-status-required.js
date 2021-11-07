'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('OrdersStatuses', [
            {
                id: uuidv4(),
                key: 'WAITING_CONFIRM',
                name: 'Chờ xác nhận',
                sortIndex: 0,
                required: true,
                isDeleted: false,
                color: '9B9B9B',
                allowEmployee: false,
                requiredTakePicture: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: 'PICKUPED_ORDERS',
                name: 'Đã lấy hàng',
                sortIndex: 1,
                required: true,
                isDeleted: false,
                color: 'F5A623',
                allowEmployee: true,
                requiredTakePicture: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: 'DELIVERY',
                name: 'Đang vận chuyển',
                sortIndex: 2,
                required: true,
                isDeleted: false,
                color: '4A90E2',
                allowEmployee: false,
                requiredTakePicture: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: 'SUCCESS',
                name: 'Giao hàng thành công',
                sortIndex: 3,
                required: true,
                isDeleted: false,
                color: '417505',
                allowEmployee: true,
                requiredTakePicture: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: 'FAILED',
                name: 'Giao hàng thất bại',
                sortIndex: 4,
                required: true,
                isDeleted: false,
                color: 'D0021B',
                allowEmployee: true,
                requiredTakePicture: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: 'CANCEL',
                name: 'Đã hủy',
                sortIndex: 5,
                required: true,
                isDeleted: false,
                color: '4A4A4A',
                allowEmployee: false,
                requiredTakePicture: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ])
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('OrdersStatuses', null, {});
    }
};

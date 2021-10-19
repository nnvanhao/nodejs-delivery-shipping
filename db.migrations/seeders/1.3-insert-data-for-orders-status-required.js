'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('OrdersStatuses', [
            {
                id: uuidv4(),
                name: 'Chờ xác nhận',
                sortIndex: 0,
                required: true,
                isDeleted: false,
                requiredTakePicture: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Đang vận chuyển',
                sortIndex: 1,
                required: true,
                isDeleted: false,
                requiredTakePicture: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Giao hàng thành công',
                sortIndex: 2,
                required: true,
                isDeleted: false,
                requiredTakePicture: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Đã hủy',
                sortIndex: 3,
                required: true,
                isDeleted: false,
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

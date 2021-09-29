const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");

const { User, UserToken, RoleType, UserRole, sequelize } = db;

const getUsersService = async (req) => {
    try {
        const { query } = req;
        const { page, pageSize, fullName } = query || {};
        const offset = (parseInt(page) - 1) || undefined;
        const limit = parseInt(pageSize) || undefined;;
        const { count, rows } = await User.findAndCountAll({
            where: fullName && {
                fullName: {
                    [Op.like]: `%${fullName}%`
                }
            },
            include: 
                {
                    model: UserRole,
                    attributes: ['id'],
                    include: [
                        {
                            model: RoleType,
                            attributes: ['name']
                        }
                    ]
                }
            ,
            attributes: { exclude: ['password'] },
            offset,
            limit,
            order: [
                ['createdAt', 'DESC']
            ],
        });
        return {
            items: rows,
            total: count
        };
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    getUsersService,
};

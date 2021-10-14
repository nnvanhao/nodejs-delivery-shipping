const nodemailer = require("nodemailer");
const dayjs = require('dayjs');
const config = require('../config/env');
const { SHIPPING_FEE_PAYMENT_TEXT } = require("../constants/common.constant");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (from = config.MAILER.FROM, to, subject, text, html) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            // port: 587,
            // secure: false, // true for 465, false for other ports
            auth: {
                user: config.MAILER.USERNAME,
                pass: config.MAILER.PASSWORD,
            },
        });
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });
        return info;
    } catch (error) {
        return null;
    }
}

const activeUserTemplate = (fullName, token, host, password) => {
    return {
        htmlBody: `
            <p>Chào mừng ${`<b style="font-size: 14px;">${fullName || 'bạn'}</b>`} đến với VivuShip,</p>
            ${password ? `<p>Mật khẩu của bạn là: <b style="font-size: 14px;">${password}</b></p>` : ''}
            <p>Vui lòng <a style="color: #1e1ebb; font-size: 14px;" href="${config.METHOD}${host}/activateUser?token=${token}">Nhấn vào đây để kích hoạt tài khoản và đăng nhập</a></p>
        `,
        subject: 'Kích hoạt tài khoản'
    }
}

const forgotPasswordTemplate = (fullName, token, host) => {
    return {
        htmlBody: `
            <p>Chào ${`<b style="font-size: 14px;">${fullName || 'bạn' }</b>`},</p>
            <p>Chúng tôi đã nhận được yêu cầu quên mật khẩu của bạn</P>
            <p>Vui lòng <a style="color: #1e1ebb; font-size: 14px;" href="${config.METHOD}${host}/reset-password?token=${token}">Nhấn vào đây để đặt lại mật khẩu</a></p>
        `,
        subject: 'Quên mật khẩu'
    }
}

const ordersTemplate = (orders) => {
    const {
        code,
        pickupName,
        ordersName,
        ordersQuantity,
        shippingFeePayment,
        shippingFee,
        totalValue,
        recipientAmountPayment,
        isCOD,
        createdAt,
        pickupAddress,
        recipientAddress,
        pickupProvinceInfo: { name: pickupProvinceName },
        pickupDistrictInfo: { name: pickupDistrictName },
        pickupWardInfo: { name: pickupWardName },
        recipientProvinceInfo: { name:recipientProvinceName },
        recipientDistrictInfo: { name: recipientDistrictName },
        recipientWardInfo: { name: recipientWardName }
    } = orders;
    return {
        htmlBody: `
        <div>
            <div style="height: 70px; background: #207346; width: 100%; text-align: center;line-height: 70px;">
            <p style="font-size: 25px; font-weight: 600; color: white">
                Cảm ơn bạn đã sử dụng dịch vụ của VivuShip
            </p>
            </div>
            <div style="padding: 0px 50px">
            <div>
                <p>Xin chào ${pickupName},</p>
                <p>Cảm ơn bạn đã dùng dịch vụ giao hàng của VivuShip. Dưới đây là thông tin đơn hàng của bạn.</p>
            </div>
            <div>
                <span style="font-size: 18px; font-weight: 600">
                Đơn hàng ${code}
                </span>
                <span style="font-size: 16px; font-weight: 600">
                Tạo ngày ${dayjs(createdAt).format("DD-MM-YYYY HH:mm:ss")}
                </span>
            </div>
            <div>
                <table style=" border-collapse: collapse; width: 100%;margin-top: 30px;">
                <tr style="background-color: #207346; color: white; font-size: 18px;">
                    <th style="text-align: left;padding: 8px">Sản phẩm</th>
                    <th style="text-align: left;padding: 8px">Số lượng</th>
                    <th style="text-align: left;padding: 8px">Giá</th>
                </tr>
                <tr>
                    <td style="text-align: left;padding: 8px;">${ordersName}</td>
                    <td style="text-align: left;padding: 8px;">${ordersQuantity}</td>
                    <td style="text-align: left;padding: 8px;"></td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="text-align: left;padding: 8px;">Tổng giá trị đơn hàng</td>
                    <td style="text-align: left;padding: 8px;"></td>
                    <td style="text-align: left;padding: 8px;">${totalValue}</td>
                </tr>
                <tr>
                    <td style="text-align: left;padding: 8px;">Phí giao hàng</td>
                    <td style="text-align: left;padding: 8px;"></td>
                    <td style="text-align: left;padding: 8px;">${shippingFee}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="text-align: left;padding: 8px;">Thanh toán cước phí vận chuyển</td>
                    <td style="text-align: left;padding: 8px;"></td>
                    <td style="text-align: left;padding: 8px;">${SHIPPING_FEE_PAYMENT_TEXT[shippingFeePayment] || ''}</td>
                </tr>
                <tr>
                    <td style="text-align: left;padding: 8px;">Tiền thu khách</td>
                    <td style="text-align: left;padding: 8px;"></td>
                    <td style="text-align: left;padding: 8px;">${recipientAmountPayment}</td>
                </tr>
                </table>
                <table style=" border-collapse: collapse; width: 100%;margin-top: 30px;">
                <tr>
                    <th style="text-align: left;padding: 8px;">Địa chỉ lấy hàng</th>
                    <th style="text-align: left;padding: 8px;">Địa chỉ giao hàng</th>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="text-align: left">
                    <p>
                        ${pickupAddress}
                    </p>
                    <p>
                        ${pickupWardName}, ${pickupDistrictName}, ${pickupProvinceName}
                    </p>
                    </td>
                    <td style="text-align: left">
                    <p>
                        ${recipientAddress}
                    </p>
                    <p>
                        ${recipientWardName}, ${recipientDistrictName}, ${recipientProvinceName}
                    </p>
                    </td>
                </tr>
                </table>
            </div>
            </div>
        </div>
        `,
        subject: 'Thông tin đơn hàng'
    }
}

module.exports = {
    sendEmail,
    activeUserTemplate,
    forgotPasswordTemplate,
    ordersTemplate
};

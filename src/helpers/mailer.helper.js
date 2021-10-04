const nodemailer = require("nodemailer");
const config = require('../config/env');

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
            <p>Chào mừng ${`<b style="font-size: 14px;">${fullName}</b>` || 'bạn'} đến với Vivu Ship,</p>
            ${password ? `<p>Mật khẩu của bạn là: <b style="font-size: 14px;">${password}</b></p>` : ''}
            <p><a style="color: #1e1ebb; font-size: 14px;" href="${config.METHOD}${host}/activateUser?token=${token}">Nhấn vào đây để kích hoạt tài khoản và đăng nhập</a></p>
        `,
        subject: 'Kích hoạt tài khoản'
    }
}
module.exports = {
    sendEmail,
    activeUserTemplate
};

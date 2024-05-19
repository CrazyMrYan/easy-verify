const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const { client } = require('../redis-client/index.js');

require('dotenv').config({ path: '.env.local' });

// 创建nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendVerificationEmail = async (to, username = 'Dear', verificationCode ) => {
    const templatePath = path.join(__dirname, '../template/theme.ejs');
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = ejs.render(template, { username, verificationCode, senderName: process.env.EMAIL_SEND_NAME });
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject: 'Your Verification Code',
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        return new Error(`Error sending email: ${error}`);
    }
};

const storeVerificationCode = async (email, code) => {
    await client.set(email, code, {
        EX: process.env.CODE_EXPIRE_TIME,
        NX: true,
    }); // 设置有效期为2分钟
};


module.exports = {
    sendVerificationEmail,
    storeVerificationCode
};
const express = require('express');
const bodyParser = require('body-parser');
const { sendVerificationEmail, storeVerificationCode } = require('./controller/sendMail');
const verifyCode = require('./utils/verify-code');
const { client } = require('./redis-client/index.js');
const { validateEmail } = require('./utils/format');

const app = express();
app.set('server.timeout', 10000);
app.use(bodyParser.json());

(async () => {
    await client.connect();
    console.log(`Redis startup completed`);
    console.log(`Redis enabled status: ${client.isOpen}`)
})();

app.post('/send-code', async (req, res) => {
    const { email, username, senderName } = req.body;
    const result = await client.get(email);
    // 已存在此邮箱数据
    if(result) {
        return res.status(409).json({ msg: 'Please do not repeatedly initiate requests, they can be initiated again after two minutes.' });
    }
    // 邮箱格式不正确
    if(!validateEmail(email)) {
        return res.status(400).json({ msg: 'Invalid email format' })
    }
    // 生成验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        // 发送验证码邮件
        await sendVerificationEmail(email, username, verificationCode, senderName);
        // 存储验证码至 redis
        await storeVerificationCode(email, verificationCode);

        res.status(201).json({ msg: 'Verification code sent.' });
    } catch (error) {
        res.status(500).json({ msg: 'Error sending verification code.' });
    }
});

app.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    await verifyCode(email, code, (err, isValid) => {
        if (err) {
            return res.status(500).json({ msg: 'Error verifying code.' });
        }
        if (isValid) {
            return res.status(204).json({ msg: 'Verification code is valid.' });
        }
        return res.status(400).json({ msg: 'Verification code is invalid or expired.' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

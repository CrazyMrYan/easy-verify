const { client } = require('../redis-client/index.js');

const verifyCode = async (email, code, callback) => {
    try {
        const result = await client.get(email);
        console.log(result === code, result, code);
        if(result === code) {
            client.del(email)
            return callback(null, true);
        }
        else return callback(null, false)
    } catch (error) {
        callback(error, false);
    }
};

module.exports = verifyCode;
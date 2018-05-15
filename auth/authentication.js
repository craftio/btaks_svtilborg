const config = require('../config.json');
const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = Buffer(config.secretKey);

function encodeToken(email) {
    const playload = {
        exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: String(email)
    };
    return jwt.encode(playload, config.secretKey);
}

function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, secretKey);

        // Check if the token has expired. To do: Trigger issue in db ..
        const now = moment().unix();

        // Check if the token has expired
        if (now > payload.exp) {
            console.log('Token has expired.');
        }

        // Return
        cb(null, payload);

    } catch(err) {
        cb(err, null);
    }
}


module.exports = {
    encodeToken,
    decodeToken
};
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.authenticate = (request, response, next) => {
    const headers = request.headers['authorization'];
    const token = headers && headers.split(' ')[1];
    if (token == null) return response.status(401).send();

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return response.status(403).send();

        console.log(user);
        next();
    });
}

exports.generate = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}
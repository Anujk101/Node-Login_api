const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    const token = req.header('auth-token');



    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, 'secret');
        req.user = verified;
        console.log(req.user);

        next();
    } catch (error) {
        res.status(400).send('Invalid token')
    }
};



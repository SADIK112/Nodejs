const jwt = require('jsonwebtoken');

function checkSetToken(req, res, next) {
    const authHeader = req.get('authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.SECRET_TOKEN, (error, user) => {
                if (error) {
                    console.log(error)
                }
                req.user = user
                next();
            })
        } else {
            next()
        }
    } else {
        next()
    }
}

function isLoggedIn(req, res, next) {
    console.log(req.user)
    if (req.user) {
        next();
    } else {
        const error = new Error("Unauthorized 🤐");
        res.status(401)
        next(error)
    }
}

module.exports = { checkSetToken, isLoggedIn }
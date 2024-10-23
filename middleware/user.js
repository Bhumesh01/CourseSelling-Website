const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.U_JWT_SECRET;

function userMiddleware(req, res, next){
    const token = req.headers.authorization;
    const decoded_inf = jwt.verify(token, JWT_SECRET);
    if(decoded_inf){
        req.userId = decoded_inf.userId;
        next();
    }
    else{
        res.status(403).json({
            msg: "You are not signed In"
        })
    }
}
module.exports = {
    userMiddleware: userMiddleware
}
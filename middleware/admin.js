const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.A_JWT_SECRET;

function adminMiddleware(req, res, next){
    const token = req.headers.authorization;
    const decoded_inf = jwt.verify(token, JWT_SECRET);
    if(decoded_inf){
        req.adminId = decoded_inf.adminId;
        next();
    }
    else{
        res.status(403).json({
            msg: "You are not signed in"
        })
    }
}
module.exports = {
    adminMiddleware: adminMiddleware
}
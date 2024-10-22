const {Router} = require('express');

const userRouter = Router(); // userRouter is the place that will handel the incoming requests

userRouter.post('/signup', (req, res)=>{
    res.json({
        msg: "signup endpoint"
    })
});
userRouter.post('/signin', (req, res)=>{
    res.json({
        msg: "signin endpoint"
    })
});
userRouter.get('/purchase', (req, res)=>{
    res.json({
        msg: "views courses purchased by user endpoint"
    })
});
module.exports = {
    userRouter: userRouter
}
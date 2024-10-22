const {Router} = require('express');
const courseRouter = Router();

courseRouter.post('/purchase', (req, res)=>{
    res.json({
        msg: "course purchase endpoint"
    })
});
courseRouter.get('/preview', (req, res)=>{
    res.json({
        msg: "view courses endpoint"
    })
});

module.exports = {
    courseRouter: courseRouter
}
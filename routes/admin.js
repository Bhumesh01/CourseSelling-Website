const {Route} = require('express');
const adminRouter = Route();

adminRouter.post('/signup', (req, res)=>{
    res.json({
        msg: "Admin signup endpoint"
    })
})
adminRouter.post('/signin', (req, res)=>{
    res.json({
        msg: "Admin signin endpoint"
    })
})
adminRouter.post('/course', (req, res)=>{
    res.json({
        msg: "create course endpoint"
    })
})
adminRouter.put('/add', (req, res)=>{
    res.json({
        msg: "update course endpoint"
    })
})
adminRouter.delete('/delete', (req, res)=>{
    res.json({
        msg: "course delete endpoint"
    })
})
adminRouter.get('/course/bulk', (req, res)=>{
    res.json({
        msg: "displays all courses endpoint"
    })
})
module.exports = {
    adminRouter: adminRouter
}
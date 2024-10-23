const {Router} = require('express');
const {purchaseModel, courseModel} = require("../db");
const courseRouter = Router();
const {userMiddleware} = require("../middleware/user")

courseRouter.post('/purchase',userMiddleware, async (req, res)=>{
    try{
        const userId = req.userId;
        const {courseId} = req.body;
        if(userId && courseId){
            const purchaseCourse = await purchaseModel.create({
                courseId: courseId,
                userId: userId
            });
            return res.json({
                msg: "You have Purchased a new course",
                purchaseId: purchaseCourse._id
            });
        }
        else{
            return res.status(404).json({
                msg: "No such course"
            });
        }
    }
    catch(err){
        return res.status(403).json({
            msg: "Unauthorised",
            error: err
        });
    }
    res.json({
        msg: "course purchase endpoint"
    })
});
courseRouter.get('/preview', async (req, res)=>{
    const courses = await courseModel.find({});
    res.json({
        msg: courses
    })
});

module.exports = {
    courseRouter: courseRouter
}
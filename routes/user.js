const {Router} = require('express');
const {userModel, purchaseModel, courseModel} = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {z} = require('zod');
require('dotenv').config();
const userRouter = Router(); // userRouter is the place that will handel the incoming requests
const {userMiddleware} = require("../middleware/user");
const JWT_SECRET = process.env.U_JWT_SECRET;
userRouter.post('/signup', async (req, res)=>{
    const emailSchema = z.string().email().min(12);
    const passwordSchema = z.string().min(7).max(100)
                           .refine((pass)=>/[A-Z]/.test(pass), {
                            message: "password must contain atleast one uppercase"
                           })
                           .refine((pass)=>/[a-z]/.test(pass), {
                            message: "password must contain atleast one lowercase"
                           })
                           .refine((pass)=>/[0-9]/.test(pass), {
                            message: "password must contain atleast one digit"
                           })
                           .refine((pass)=>/[@!#$%^&*]/.test(pass), {
                            message: "password must contain atleast one special symbol"
                           });
    const firstNameSchema = z.string().min(3).max(20);
    const lastNameSchema = z.string().max(20);
    try{
        const {email, password, firstName, lastName} = req.body;
        const safeParseEmail = emailSchema.safeParse(email);
        const safeParsepassword = passwordSchema.safeParse(password);
        const safeParseFirstName = firstNameSchema.safeParse(firstName);
        const safeParseLastName = lastNameSchema.safeParse(lastName);
        const hashedPassword = await bcrypt.hash(password, 5);
        if(safeParseEmail && safeParsepassword && safeParseFirstName && safeParseLastName){
            await userModel.create({
                email:email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName
            });
            res.json({
                msg: "You have Successfully signed Up"
            })
        }
    }
    catch(err){
        res.status(403).json({
            msg: err
        })
    }
});
userRouter.post('/signin', async (req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({
            email: email
        });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(user && passwordMatch){
            const token = jwt.sign({userId: user._id}, JWT_SECRET);
            res.json({
                msg: "YOu have successfully signed In",
                token: token
            })
        }
        else {
            return res.status(403).json({
                msg: "Invalid email or password"
            });
        }
    }
    catch(err){
        console.error(err);
        return res.status(403).json({
            msg: "Unauthorized",
            error: err.message
        });
    }
});
userRouter.use(userMiddleware);
userRouter.get('/purchase', async (req, res)=>{
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId: userId
    });
    const courseData = await courseModel.find({
        _id: purchases.map((purchase)=> (purchase.courseId))
    })
    res.json({
        purchases: purchases,
        courseData: courseData
    })
});
module.exports = {
    userRouter: userRouter
}
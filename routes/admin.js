const {Router} = require('express');
const adminRouter = Router();
const {adminModel, courseModel} = require("../db");
const {z} = require('zod');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {adminMiddleware} = require("../middleware/admin")

const JWT_SECRET = process.env.A_JWT_SECRET;

adminRouter.post('/signup', async (req, res)=>{
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
        const { email, password, firstName, lastName } = req.body;
        const safeParseEmail = emailSchema.safeParse(email);
        const safeParsepassword = passwordSchema.safeParse(password);
        const safeParseFirstName = firstNameSchema.safeParse(firstName);
        const safeParseLastName = lastNameSchema.safeParse(lastName);
        const hashedPassword = await bcrypt.hash(password, 5);
        if(safeParseEmail && safeParsepassword && safeParseFirstName && safeParseLastName){
            await adminModel.create({
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName
            });
            res.json({
                msg: "You have Signed Up successfully"
            });
        }
    }
    catch(err){
        res.json({
            msg: err
        });
    }
})
adminRouter.post('/signin', async (req, res)=>{
    try{
        const { email, password } = req.body;
        const admin = await adminModel.findOne({
            email: email
        });
        console.log("Found admin");
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if(admin && passwordMatch){
            const token = jwt.sign({adminId: admin._id}, JWT_SECRET);
            res.json({
                msg: "You have successfully Signed In",
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
})
adminRouter.use(adminMiddleware);
adminRouter.post('/course', async (req, res)=>{
    try{
        const adminId = req.adminId;
        const {title, description ,price, imageUrl} = req.body;
        const course = await courseModel.create({
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
            creatorId: adminId
        })
        res.json({
            msg: "course Created",
            courseId: course._id
        })
    }
    catch(err){
        res.status(403).json({
            msg: "Check The Details of the Course"
        })
    }
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
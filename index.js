const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin");

const app = express();
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5500/"
}))
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/course', courseRouter);
async function main(){
    await mongoose.connect(CONNECTION_STRING);
    app.listen(3000);
    console.log("Listening to port 3000");
}

main();
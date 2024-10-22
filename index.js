const express = require('express');
const app = express();

app.use(express.json());

app.post('/user/signup', (req, res)=>{
    res.json({
        msg: "signup endpoint"
    })
});
app.post('/user/signin', (req, res)=>{
    res.json({
        msg: "signin endpoint"
    })
});
app.post('/course/purchase', (req, res)=>{
    res.json({
        msg: "course purchase endpoint"
    })
});
app.get('/courses', (req, res)=>{
    res.json({
        msg: "view courses endpoint"
    })
});
app.get('/user/purchase', (req, res)=>{
    res.json({
        msg: "views courses purchased by user endpoint"
    })
});
app.listen(3000);
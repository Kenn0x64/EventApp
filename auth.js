const express = require("express");
const cors=require("cors");
const database=require("./utils/database")
const app = express();
const jwt = require("jsonwebtoken")
const {authJWT_RT,authJWT_AT}=require("./utils/middlewares")


//Settings
app.set('json spaces',10)

//middleweres
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())

//Routes
app.post('/RT',authJWT_RT,(req,res)=>{
    let AT = jwt.sign({
        id: req.logedinUser.id
    }, process.env.ACCESS_TOKEN, { expiresIn: "5m", algorithm: "HS512" })

    res.sendStatus(203).send({
        AT: "Bearer " + AT
    })
})

const PORT=process.env.AUTH_PORT || 9000 
app.listen( PORT, () => {
    process.stdout.write('\033c');
    console.log(`\n\u2705 AuthServer Startred! [http://localhost:${PORT}/RT]`)
})
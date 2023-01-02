require("./utils/database")
const express = require("express");
const cors=require("cors");
const app = express();
const path=require("path")
const userRouter=require("./routers/user")
const eventRouter=require("./routers/event")
const orgRouter=require("./routers/org")
const { authJWT_AT } = require("./controllers/auth")
const { genCert } = require('./utils/shared_funs');


//Settings
app.set('json spaces',10)

//middleweres
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/uploads',
// authJWT_AT,
express.static(path.join(__dirname,'/public')))

app.use('/uploads',
// authJWT_AT,
express.static(path.join(__dirname,'/images')))

app.use(cors())
 
//Routers
app.use('/user',userRouter)
app.use('/org',orgRouter)
app.use('/event',eventRouter)


app.get('/test',(req,res)=>{
    res.send("Test")
})

const PORT=process.env.PORT || 4000 
app.listen( PORT, async () => {
    process.stdout.write('\x1Bc');
    console.log(`\n\u2705 Startred Server! [ http://localhost:${PORT}/ ]`)
    // await genCert(0)

})

module.exports=app
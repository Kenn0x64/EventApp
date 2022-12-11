//Imports
require("./utils/database")
const express = require("express");
const cors=require("cors");
const app = express();
const path=require("path")
const userRouter=require("./routers/user")
const eventRouter=require("./routers/event")



//Settings
app.set('json spaces',10)

//middleweres
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/uploads',express.static(path.join(__dirname,'/public')))
app.use(cors())

//Routers
app.use('/user',userRouter)
app.use('/event',eventRouter)

app.get('/test',(req,res)=>{
    res.send("Test")
})

const PORT=process.env.PORT || 4000 
app.listen( PORT, () => {
    process.stdout.write('\033c');
    console.log(`\n\u2705 Startred Server! [ http://localhost:${PORT}/ ]`)
})
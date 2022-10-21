const database =require("./utils/database")
const express = require("express");
const userRouter=require("./routers/user")
const eventRouter=require("./routers/event")
const app = express();

//middleweres
app.use(express.json());


//Routers
app.use('/user',userRouter)
app.use('/event',eventRouter)

app.listen( process.env.PORT, () => {
    const PORT=process.env.PORT | 3000
    console.log(`\u2705 Startred Server! [http://localhost:${PORT}/]`)
})
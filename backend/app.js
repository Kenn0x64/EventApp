let express = require("express")
let app= express();

app.get('/43',(req,res)=>{
    console.log("X")

})

port=process.env.PORT | 3000

app.listen(port,()=>{
    console.log("X")
})
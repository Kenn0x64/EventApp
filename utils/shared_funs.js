const fs=require('fs')
const crypto= require("crypto")

function RESPONSE(status,code,result) {
    return {
        Status:status,
        StatusCode:code,
        Result:result
    }
}
function deleteImages(images) {
    images.forEach(image => {
        console.log(`image:${image} Deleted`);
        fs.unlink(image,(err)=>{
            if (err) { 
             console.log(err); 
             return   
            }
        })       
    });    
}

function handle(fun) {
    return (req,res,next) =>{
        fun(req,res,next).catch(next)
    }
}


function genSessionID() {
    let time=Date.now()
    let rd=crypto.randomBytes(512).toString('hex')
    let hmac=crypto.createHmac('sha512',process.env.SEC || "X")
        .update(`${time}${rd}`)
        .digest('hex')
    return`${hmac}${time}${rd}`
}

module.exports={
    RESPONSE,
    deleteImages,
    handle,
    genSessionID
}
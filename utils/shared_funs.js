const fs=require('fs')

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


module.exports={
    RESPONSE,
    deleteImages,
    handle
}
function RESPONSE(status,code,message,result) {
    return {
        Status:status,
        StatusCode:code,
        Message:message,
        Result:result
    }
}
module.exports=RESPONSE
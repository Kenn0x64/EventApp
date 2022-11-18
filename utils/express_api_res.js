function RESPONSE(status,code,result) {
    return {
        Status:status,
        StatusCode:code,
        Result:result
    }
}
module.exports=RESPONSE
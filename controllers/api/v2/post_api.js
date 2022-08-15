module.exports.index = function(req,res){
    return res.status(200).json({
        message : "API, version 2, All ok, boi"
    })
}
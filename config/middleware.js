module.exports.flashController = function(req, res, next){
    res.locals.flash = {        //The res.locals are the function that will be available to the view engine, this simply means it will be used to output some or other thing in final html page.
        'success' : req.flash('success'),       //This will be checked for each and every possible end point hit, but in majority of end point this will contain null. Since only few pages need to contain the flash message.
        'error' : req.flash('error')
    }
    next();
};
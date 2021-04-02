// this middleware is created so that logged user cant go to login or register route if he'll
// try that he'll be redirected to home page instead
// so it will be necessary for user to not logged in to go to login or register page
// in middleware three parameters req , res n next a callback func
function guest(req, res, next){
    if(!req.isAuthenticated()){ // this isAuthenticate is provided from passport
        return next()

    }
    return res.redirect('/')
}

module.exports = guest
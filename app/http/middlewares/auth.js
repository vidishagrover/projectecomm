// so that only logged in user can access orders page
function auth( req, res , next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/login')
}

module.exports = auth
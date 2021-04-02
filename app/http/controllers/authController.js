const User = require('../../models/user')
const bcrypt = require('bcrypt') // it is used to hash passwords
const passport = require('passport')
function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

    return {
        //index is a function
        login(req, res) {
            res.render('auth/login')

        },
        postLogin(req, res, next) { 
            const {email, password } = req.body
            // validate request
            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            // next to proceed
            // first parameter in authenticate is which strategy next is the done callback function in passport.js
            passport.authenticate('local', (err, user, info) => {

                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                //this login is defined in passport itself
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req)) // this is private method

                })

            })(req, res, next) // it is called this way


        },
        register(req, res) {
            res.render('auth/register')

        },
        async postRegister(req, res) {
            const { name, email, password } = req.body
            // validate request
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)  // these are used for sending back info again incase all fields are not filled but filled info will be sent back
                req.flash('email', email) // here 'email' is key by ourselves and email is value attribute which is mentioned in register.ejs
                return res.redirect('/register')
            }
            // check if email exists
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already exists')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            // Hash password 
            // await cant be used like this so we need to make the parent func async
            const hashedPassword = await bcrypt.hash(password, 10) // salting round is 10


            // create a user
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })
            user.save().then((user) => {
                return res.redirect('/')

            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')

            })
            
        },
        logout(req, res){ 
            req.logout() // with passport it is very easy to logout
            return res.redirect('/login')
        }
    }
}

module.exports = authController
require ('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
const passport = require('passport') //for authentication i.e login and logout
const Emitter = require('events')

//Database Coonection
const url = 'mongodb://localhost/clothes';
mongoose.connect(url, { useNewUrlParser : true, 
useCreateIndex: true, useUnifiedTopology : true, useFindAndModify : true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected');
}).catch(err => {
    console.log('Connection failed')

});


// Session store
let mongoStore= new MongoDbStore({
    mongooseConnection : connection,
    collection: 'sessions'
})

// Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter) // as it is set in app we can use this anywhere in our application
//Session config

app.use(session({
    secret : process.env.COOKIE_SECRET ,
    resave: false,
    store: mongoStore ,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24} //24 hrs

}))

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport) // this passport is one which we have installed
app.use(passport.initialize())
app.use(passport.session())

app.use(flash()) // used to flash or send message whwnever a user is redirecting to a specific web page

// Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//Global middleware , providing session in ejs file ,
//  this will make session and user available in frontend
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next() //have to call next() or req will be stuck
})

// set Template engine
app.use(expressLayout);
app.set('views' , path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// importing routes
require('./routes/web')(app) ;
app.use((req, res) => {
    res.status(404).send('<h1>404 page not found </h1>')
})


const server = app.listen(PORT, ()=>{
    console.log(`running on  ${PORT} `) 
    //  these are above tab//

});

// Socket

const io = require('socket.io')(server) // server given which will be used for socket
io.on('connection', (socket) =>{
    // Join 
    // console.log(socket.id)// socket id
    socket.on('join', (orderId) =>{ // this join remain similar as mentioned in app.js
        // console.log(orderId)
        socket.join(orderId)

    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced' , (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})
const Payment = require('../../../models/payment')
const moment = require('moment') // it is used to modify dates in javascript
function paymentController(){
    return {
        store(req, res){
           // Validate Request
           const { phone, address } =req.body
           if(!phone || !address){
               req.flash('error ' , 'All fields are required')
               return res.redirect('/cart')
           }
           const payment = new Payment ({
               customerId : req.user._id,  //this is accessed through passport.js
               items : req.session.cart.items,
               phone : phone , // phone n address are received from above
               address: address // and we dont need to mention paymentType and status as their default value is mentioned
           }) 
           payment.save().then(result => {
               Payment.populate(result, {path: 'customerId'}, (err, placeOrder) => {
               req.flash('success', 'Order placed successfully')
               delete req.session.cart // this to empty cart to delete after ordering
               // Emit
               const eventEmitter = req.app.get('eventEmitter')
               eventEmitter.emit('orderPlaced', placeOrder)
               return res.redirect('/customer/orders')
           })
           }).catch(err =>{
               req.flash('error','Something went wrong')
               return res.redirect('/cart')
           })


        },
        // getting orders
        async index(req, res){
            const orders = await Payment.find({ customerId: req.user._id },  
                // from here it is written to arrange orders in descending order
                null ,{
                sort: { 'createdAt' : -1 } })
                res.header('Cache-Control', 'no-store')
  
            res.render('customers/orders', {orders : orders, moment: moment}) // used in order.ejs
           
        },
        async show(req, res){
            const payment = await Payment.findById(req.params.id)
            // Authorize User
            if(req.user._id.toString() === payment.customerId.toString()){
                return res.render('customers/singleOrder', {payment})
            } 
            return res.redirect('/')
            

        }
    }
}

module.exports = paymentController
const Payment = require("../../../models/payment")
function paymentController(){
    return {
        index(req, res){
            Payment.find({ status: { $ne: 'completed' }} , null,
                {sort: { 'createdAt' : -1}}). // populate is used to fetch all the info about that customerId as customerID stores objectId and through that we 'll get all info and we dont need password so -password
                populate('customerId', '-password').exec((err, orders)=>{
                    if(req.xhr){
                        return res.json(orders)
                    }else{
                    res.render('admin/orders')
                    }
                })


        }
    }
}
module.exports = paymentController
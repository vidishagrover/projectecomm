function cartController() {
    return {
        //index is a function
        cart(req, res) {
            res.render('customers/cart')
            //we can get data from session and then send but session is available on our frontend
            //  so we will do it in cart.ejs file only

        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         clothId : {item : clothObject, qty: 0},
            //         clothId : {item : clothObject, qty: 0},
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for first time creating cart n adding basic object structure that is cart isn't there
            if (!req.session.cart) { //if cart not available make cart n store in it
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart


            // check if item doent exist
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }

            return res.json({ totalQty: req.session.cart.totalQty }) //totalQty is data here
            
        }
    }
}

module.exports = cartController
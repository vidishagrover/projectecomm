const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const paymentController = require('../app/http/controllers/customers/paymentController');
const adminPaymentController = require('../app/http/controllers/admin/paymentController');
const statusController = require('../app/http/controllers/admin/statusController');
// Middlewares
const guest = require('../app/http/middlewares/guest') ;
const auth = require('../app/http/middlewares/auth') ;
const admin = require('../app/http/middlewares/admin') ;

function initRoutes(app) {
    app.get('/', homeController().index);
    app.get('/login', guest, authController().login);
    app.post('/login', authController().postLogin);
    app.get('/register', guest, authController().register);
    app.post('/register', authController().postRegister);
    app.post('/logout', authController().logout);
    app.get('/cart', cartController().cart);
    app.post('/update-cart', cartController().update);

    // Customer routes

    app.post('/payment', auth , paymentController().store);
    app.get('/customer/orders', auth, paymentController().index);
    app.get('/customer/orders/:id', auth, paymentController().show);


     // Admin routes
    app.get('/admin/orders', admin, adminPaymentController().index);
    app.post('/admin/order/status', admin, statusController().update);
    


}


module.exports = initRoutes
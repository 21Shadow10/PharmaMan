const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');

const shopController = require('./controllers/shop');
const userController = require('./controllers/auth');
const adminController = require('./controllers/admin');
const errorController = require('./controllers/error');

const pagination = require('./util/pagination');
const access = require('./util/access');
const multer = require('./util/multer');

require('dotenv').config();
//Passport config
require('./config/passport')(passport);
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');
// express app
const app = express();

// listen for requests
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session
app.use(
    session({
        secret: process.env.DB_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //console.log('MongoDB Connected');
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => console.log(err));


//Routing

app.get('/home', ensureAuthenticated, pagination.paginatedResults(Product), shopController.getHomePage);

app.get('/about', ensureAuthenticated, (req, res) => {
    res.render('about', { title: 'About', user: req.user });
});

app.get('/products', ensureAuthenticated, pagination.paginatedResults(Product), shopController.getProductsPage);

app.get('/products/:id', ensureAuthenticated, shopController.getProductDetails);


//Account Routes
app.get('/account', ensureAuthenticated, userController.getAccount);

app.post('/account', ensureAuthenticated, multer.upload.single('image'), userController.postAccount);

app.post('/account-edit', ensureAuthenticated, userController.postAccountEdit);

//Login Routes
app.get('/', forwardAuthenticated, userController.getLogin);

app.get('/login', forwardAuthenticated, userController.getLogin);

app.get('/register', forwardAuthenticated, userController.getRegister);

app.post('/register', userController.PostRegister);

app.post('/login', userController.postLogin);

app.get('/logout', userController.getLogout);


// Admin Pages
app.get('/admin/modify', ensureAuthenticated, access.accessFunc, adminController.getModify);

app.get('/admin/add', ensureAuthenticated, access.accessFunc, adminController.getAddPage);

//add medicine
app.post('/admin', ensureAuthenticated, multer.upload.single('src'), adminController.PostAddMedicine);

app.get('/admin/:id', ensureAuthenticated, access.accessFunc, adminController.getEditMeds);

app.post('/admin/edit/:id', ensureAuthenticated, multer.upload.single('src'), adminController.postEditMeds);

app.get('/admin/delete/:id', ensureAuthenticated, access.accessFunc, adminController.deleteMeds);


//Cart Routes
app.post('/cart/:id', ensureAuthenticated, shopController.postProductToCart);

app.get('/cart', ensureAuthenticated, shopController.getCartPage);

//to update quantity values in cart
app.post('/update/:id', ensureAuthenticated, shopController.updateCart);

app.get('/cart/delete', ensureAuthenticated, shopController.deleteCart);

app.get('/orders', ensureAuthenticated, shopController.getOrders);

app.post('/orders/review/:id', ensureAuthenticated, shopController.postReviews);

app.get('/place', ensureAuthenticated, shopController.placeOrder);

app.get('/pending', ensureAuthenticated, shopController.getPending);

app.post('/pending/:id', ensureAuthenticated, shopController.postPending);

app.get('/pending/delete/:id', ensureAuthenticated, shopController.deletePending);


// 404 page
app.use(errorController.get404);
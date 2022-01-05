const Product = require('../models/product');
const Cart = require('../models/cart');
const Invoice = require('../models/invoice');

exports.getHomePage = (req, res) => {
    var prod = res.paginatedResults.results;
    var rando = Math.floor(Math.random() * prod.length);
    var prod1 = prod[rando];
    var rando1 = Math.floor(Math.random() * (prod.length - 2));
    var prod2 = prod.slice(rando1, rando1 + 2);
    res.render('index', { title: 'Home', user: req.user, prod1, prod2 });
};

exports.getProductsPage = (req, res) => {
    var prod = res.paginatedResults.results;
    var search = res.paginatedResults.search;
    res.render('product', {
        title: 'Products',
        user: req.user,
        prod,
        search,
    });
};

exports.getProductDetails = (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then((result) => {
            res.render('product-details', {
                product: result,
                user: req.user,
                title: 'Product Details',
            });
        })
        .catch((err) => {
            console.log(err);
            res.render('404', { title: 'Product not found' });
        });
};

exports.getCartPage = (req, res) => {
    Cart.find({ username: req.user.id })
        .populate('_productid') // only works if we pushed refs to person.eventsAttended
        .exec(function(err, products) {
            if (err) return handleError(err);
            res.render('cart', { title: 'Cart', user: req.user, products });
        });
};

exports.updateCart = (req, res) => {
    console.log(req.params.id + ' ' + req.body.qty);
    const id = { _id: req.params.id, username: req.user.id };
    const qty = { quantity: req.body.qty };
    Cart.findOneAndUpdate(id, qty, { new: true })
        .then((data) => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postProductToCart = (req, res) => {
    const id = req.params.id;
    //console.log(req.body);
    req.body.username = req.user.id;
    req.body._productid = id;
    const cart = new Cart(req.body);
    //console.log(cart);
    cart
        .save()
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.deleteCart = (req, res) => {
    const id = req.query.id;

    Cart.findByIdAndDelete(id)
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res) => {
    Invoice.find({ username: req.user.id })
        .populate('_productid')
        .exec(function(err, products) {
            console.log(products);
            res.render('invoice', { title: 'Your Orders', user: req.user, products });
        });
};

exports.postReviews = (req, res) => {
    const id = req.params.id;
    Invoice.findOneAndUpdate({ _id: id }, { rating: req.body.rating }, { new: true })
        .then((data) => {
            console.log(data);
            res.redirect('/orders');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.placeOrder = (req, res) => {
    Cart.find({ username: req.user.id }).exec(function(err, products) {
        if (err) return handleError(err);
        Invoice.insertMany(products).then(function() {
            console.log('Data inserted'); // Success
            Cart.deleteMany({}).then(function() {
                console.log('cart Emptied');
            });
            res.redirect('/orders');
        });
    });
};

exports.getPending = (req, res) => {
    Invoice.find()
        .populate('_productid')
        .exec(function(err, products) {
            res.render('invoice', { title: 'Your Orders', user: req.user, products });
        });
};

exports.postPending = (req, res) => {
    const id = { _id: req.params.id };

    var state;
    if (req.query.status == 'false') state = true;
    else state = false;
    const status1 = { status: state };
    Invoice.findOneAndUpdate(id, status1, { new: true })
        .then((data) => {
            res.redirect('/pending');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.deletePending = (req, res) => {
    const id = req.params.id;
    console.log(id);
    Invoice.findByIdAndDelete(id)
        .then((result) => {
            res.redirect('/pending');
        })
        .catch((err) => {
            console.log(err);
        });
}
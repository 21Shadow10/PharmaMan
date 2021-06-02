const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const Invoice = require('./models/invoice');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
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
        console.log('MongoDB Connected');
        app.listen(3000);
    })
    .catch((err) => console.log(err));

//Products Grouping

const products = [{
        src: '/product-1.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: 50,
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-2.jpg',
        name: 'Amoxicillin',
        price: 10,
        rating: 2,
        desc: 'It can treat strep throat as well as childhood pneumonia, ear infections, and sinus infections, especially when used at high-dose levels',
        type: 'pill',
    },
    {
        src: '/product-3.jpg',
        name: 'Azithromycin',
        price: 5,
        rating: 5,
        desc: 'It is often prescribed for ear infections.',
        type: 'pill',
    },
    {
        src: '/product-4.jpg',
        name: 'Albuterol',
        price: 15,
        rating: 5,
        desc: 'The syrup form of albuterol is very rarely used by most pediatricians.',
        type: 'pill',
    },
    {
        src: '/product-5.jpg',
        name: 'Cefdinir',
        price: 16,
        rating: 5,
        desc: 'Omnicef (cefdinir) is a broad spectrum third-generation cephalosporin that is commonly used to treat sinus infections, ear infections, and pneumonia. Cefdinir is not usually considered to be a first-line treatment.',
        type: 'pill',
    },
    {
        src: '/product-6.jpg',
        name: 'Cephalexin',
        price: 7,
        rating: 3,
        desc: 'Keflex (cephalexin) is an antibiotic used to treat a range of bacterial infections, including strep throat, pneumonia, skin infections (cellulitis and impetigo), and bone and joint infections.',
        type: 'pill',
    },
    {
        src: '/product-7.jpg',
        name: 'Fluticasone',
        price: 15,
        rating: 4,
        desc: 'Fluticasone is a steroid that is the main ingredient in many different medications, including Flonase nasal spray (generic), Flovent MDI, Cutivate cream and ointment (generic), and Veramyst nasal spray.',
        type: 'pill',
    },
    {
        src: '/product-8.jpg',
        name: 'Prednisolone Sodium Phosphate',
        price: 30,
        rating: 5,
        desc: 'Available in both a 25 milligram/5 milliliter and 15 milligram/5 milliliter syrup, prednisolone is a liquid steroid that is commonly used to treat asthma flare-ups, poison ivy reactions, croup, and other corticosteroid-responsive disorders.',
        type: 'pill',
    },
    {
        src: '/product-9.jpg',
        name: 'Ibuprofen',
        price: 3,
        rating: 5,
        desc: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that is commonly used to treat fever, pain, and inflammation in children.',
        type: 'pill',
    },
    {
        src: '/product-10.jpg',
        name: 'Singulair ',
        price: 13,
        rating: 5,
        desc: 'Singulair (montelukast sodium) is a leukotriene receptor antagonist and is approved to prevent and treat asthma, prevent exercise-induced asthma, and relieve symptoms of seasonal allergic rhinitis and perennial allergic rhinitis. ',
        type: 'pill',
    },
    {
        src: '/product-11.jpg',
        name: 'Trimethoprim',
        price: 10,
        rating: 5,
        desc: 'Bactrim or Septra (trimethoprim/sulfamethoxazole) is an older antibiotic that is most commonly used to treat urinary tract infections, except when resistance might be a problem.',
        type: 'pill',
    },
    {
        src: '/product-12.jpg',
        name: 'Vicodin',
        price: 15,
        rating: 5,
        desc: 'Under the brand names of Vicodin, Lortab, and Norco, hydrocodone bitartrate/acetaminophen is a narcotic pain reliever with Tylenol (acetaminophen). It is more potent than codeine.',
        type: 'pill',
    },
];
/*Product.insertMany(products)
    .then(function() {
        console.log('Data inserted'); // Success
    })
    .catch(function(error) {
        console.log(error); // Failure
    });*/
/*Product.deleteMany({ type: 'pill' })
	.then(function () {
		console.log('Data Deleted'); // Success
	})
	.catch(function (error) {
		console.log(error); // Failure
	});*/
//Add Admin
/*username = 'Admin';
email = 'AT@gmail.com';
password = '123456';
admin = true;
const newUser = new User({
    username,
    email,
    password,
    admin,
});
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
            .save()
            .then((user) => {
                console.log(user);
            })
            .catch((err) => console.log(err));
    });
});*/
//Routing

app.get('/home', ensureAuthenticated, paginatedResults(Product), (req, res) => {
    var prod = res.paginatedResults.results;
    var rando = Math.floor(Math.random() * prod.length);
    var prod1 = prod[rando];
    var rando1 = Math.floor(Math.random() * (prod.length - 2));
    var prod2 = prod.slice(rando1, rando1 + 2);
    res.render('index', { title: 'Home', user: req.user, prod1, prod2 });
});

app.get('/about', ensureAuthenticated, (req, res) => {
    res.render('about', { title: 'About', user: req.user });
});

app.get(
    '/products',
    ensureAuthenticated,
    paginatedResults(Product),
    (req, res) => {
        var prod = res.paginatedResults.results;
        var search = res.paginatedResults.search;
        res.render('product', {
            title: 'Products',
            user: req.user,
            prod,
            search,
        });
    }
);
app.get('/products/:id', ensureAuthenticated, (req, res) => {
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
});

// account pages
//Middleware for Multer
var storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + '_' + Date.now() + path.extname(file.originalname)
        );
    },
});

var upload = multer({ storage: storage });

app.get('/account', ensureAuthenticated, (req, res) => {
    res.render('account', { title: 'Account', user: req.user });
});

app.post(
    '/account',
    ensureAuthenticated,
    upload.single('image'),
    (req, res) => {
        const user = req.user;
        const image = req.body.image;
        var img = {
            data: fs.readFileSync(
                path.join(__dirname + '/uploads/' + req.file.filename)
            ),
            contentType: 'image/png',
        };
        user.image.data = img.data;
        user.contentType = img.contentType;
        user.save();
        console.log('success');
        res.redirect('/account');
    }
);
app.post('/account-edit', ensureAuthenticated, (req, res) => {
    user = req.user;
    user.address = req.body.address;
    user.phone = req.body.phone;
    user.save();
    res.redirect('/account');
});
//Login Routes
app.get('/', forwardAuthenticated, (req, res) => res.render('login'));
app.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
app.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register');
});
app.post('/register', (req, res) => {
    const { username, email, password, password2, phone } = req.body;
    let errors = [];

    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2,
        });
    } else {
        User.findOne({ email: email }).then((user) => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    username,
                    email,
                    password,
                    password2,
                    phone,
                });
            } else {
                const newUser = new User({
                    username,
                    email,
                    password,
                    phone,
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/login');
                            })
                            .catch((err) => console.log(err));
                    });
                });
            }
        });
    }
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
});
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

// Admin Pages
app.get('/admin/modify', ensureAuthenticated, access, (req, res) => {
    Product.find()
        .then((result) => {
            res.render('admin/modify', {
                title: 'Modify',
                user: req.user,
                products: result,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/admin/add', ensureAuthenticated, access, (req, res) => {
    res.render('admin/add', { title: 'Add New Products', user: req.user });
});

app.post('/admin', ensureAuthenticated, access, (req, res) => {
    const product = new Product(req.body);
    //console.log(product);
    product
        .save()
        .then((result) => {
            res.redirect('/admin/modify');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/admin/:id', ensureAuthenticated, access, (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then((result) => {
            res.render('admin/edit', {
                title: 'Edit your Meds',
                user: req.user,
                product: result,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/admin/edit/:id', ensureAuthenticated, access, (req, res) => {
    const id = req.params.id;
    const product = req.body;

    Product.findOne({ _id: id }, (err, foundObject) => {
        if (err) {
            console.log(err);
        } else {
            if (!foundObject) {
                res.status(404).render('404', { title: '404' });
            } else {
                foundObject.name = product.name;
                foundObject.price = product.price;
                foundObject.src = product.src;
                foundObject.desc = product.desc;
                foundObject.type = product.type;
                foundObject.save((err, updateObject) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/admin/modify');
                    }
                });
            }
        }
    });
});

app.delete('/admin/:id', ensureAuthenticated, access, (req, res) => {
    const id = req.params.id;
    console.log(id);
    Product.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/admin/modify' });
        })
        .catch((err) => {
            console.log(err);
        });
});

//Cart Routes
app.post('/cart/:id', ensureAuthenticated, (req, res) => {
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
});

app.get('/cart', ensureAuthenticated, (req, res) => {
    Cart.find({ username: req.user.id })
        .populate('_productid') // only works if we pushed refs to person.eventsAttended
        .exec(function(err, products) {
            if (err) return handleError(err);
            res.render('cart', { title: 'Cart', user: req.user, products });
        });
});
//to update quantity values in cart
app.post('/update/:id', ensureAuthenticated, (req, res) => {
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
});
app.get('/cart/delete', ensureAuthenticated, (req, res) => {
    const id = req.query.id;

    Cart.findByIdAndDelete(id)
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/orders', ensureAuthenticated, (req, res) => {
    Invoice.find({ username: req.user.id })
        .populate('_productid')
        .exec(function(err, products) {
            res.render('invoice', { title: 'Your Orders', user: req.user, products });
        });
});

app.get('/place', ensureAuthenticated, (req, res) => {
    Cart.find({ username: req.user.id }).exec(function(err, products) {
        if (err) return handleError(err);
        console.log(products);
        Invoice.insertMany(products).then(function() {
            console.log('Data inserted'); // Success
            Cart.deleteMany({}).then(function() {
                console.log('cart Emptied');
            });
            res.redirect('/orders');
        });
    });
});

app.get('/pending', ensureAuthenticated, (req, res) => {
    Invoice.find()
        .populate('_productid')
        .exec(function(err, products) {
            res.render('invoice', { title: 'Your Orders', user: req.user, products });
        });
});
app.post('/pending/:id', ensureAuthenticated, (req, res) => {
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
});
app.get('/pending/delete/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    console.log(id);
    Invoice.findByIdAndDelete(id)
        .then((result) => {
            res.redirect('/pending');
        })
        .catch((err) => {
            console.log(err);
        });
});
// 404 page
app.use((req, res) => {
    message = 'OOPS, page not found :)';
    res.status(404).render('404', { title: '404', user: req.user, message });
});

/*function paginatedResults(model) {
                        return async(req, res, next) => {
                            var page;
                            var limit;
                            if (req.query.page == undefined && req.query.limit == undefined) {
                                page = 1;
                                limit = 8;
                            } else {
                                page = parseInt(req.query.page);
                                limit = parseInt(req.query.limit);
                            }
                            //console.log(page + ' ' + limit);

                            const startIndex = (page - 1) * limit;
                            const endIndex = page * limit;
                            const results = {};
                            if (endIndex < (await model.countDocuments().exec())) {
                                results.next = {
                                    page: page + 1,
                                    limit: limit,
                                };
                            }
                            if (startIndex > 0) {
                                results.previous = {
                                    page: page - 1,
                                    limit: limit,
                                };
                            }
                            try {
                                results.results = await model.find().limit(limit).skip(startIndex).exec();
                                var products = results.results;
                                const prod = [];
                                var chunkSize = 4;
                                for (let i = 0; i < products.length; i += chunkSize) {
                                    const chunk = products.slice(i, i + chunkSize);
                                    prod.push(chunk);
                                }
                                res.paginatedResults = prod;
                                next();
                            } catch (e) {
                                res.status(500).json({ message: e.message });
                            }
                        };
                    }*/
function paginatedResults(model) {
    return async(req, res, next) => {
        var page;
        var limit;
        var search;
        var sorted = req.query.sort;
        var obj = {};
        obj[sorted] = 1;
        if (req.query.page == undefined) {
            page = 1;
        } else {
            page = parseInt(req.query.page);
        }
        if (req.query.limit == undefined) limit = 8;
        else {
            limit = parseInt(req.query.limit);
        }
        if (req.query.search == undefined || req.query.search == '')
            req.query.search = '';
        else {
            search = req.query.search;
        }
        //console.log(page + ' ' + limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};

        if (endIndex < (await model.countDocuments().exec())) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        try {
            if (req.query.search == undefined || req.query.search == '') {
                results.results = await model
                    .find()
                    .sort(obj)
                    .limit(limit)
                    .skip(startIndex)
                    .exec();
            } else {
                results.results = await model
                    .find({ name: search })
                    .sort(obj)
                    .limit(limit)
                    .skip(startIndex)
                    .exec();
            }
            var products = results.results;

            const prod = [];
            var chunkSize = 4;
            for (let i = 0; i < products.length; i += chunkSize) {
                const chunk = products.slice(i, i + chunkSize);
                prod.push(chunk);
            }
            results.results = prod;
            results.search = search;
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

function access(req, res, next) {
    message =
        '404\nYou are not Authorised to access this page! \nPlease go back to Home page';
    if (!req.user.admin)
        res.status(404).render('404', { title: '404', user: req.user, message });
    else next();
}
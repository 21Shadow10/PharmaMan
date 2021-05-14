const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');

// express app
const app = express();

// listen for requests
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const dbURI =
    'mongodb+srv://AT:LETSdoMONGO0@nodetrials.vryil.mongodb.net/PharmaMan?retryWrites=true&w=majority';
mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected');
        app.listen(3000);
    })
    .catch((err) => console.log(err));

//Products Grouping
const products = [{
        src: '/product-1.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-2.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-3.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-4.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-5.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-6.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-7.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-8.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-9.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-10.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-11.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-12.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: '50$',
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
];
const prod = [];
var chunkSize = 4;
for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    prod.push(chunk);
}
//Routing
app.get('/', paginatedResults(Product), (req, res) => {
    var prod = res.paginatedResults;
    var rando = Math.floor(Math.random() * prod.length);
    var prod1 = prod[rando];
    var rando1 = Math.floor(Math.random() * (prod.length - 2));
    var prod2 = prod.slice(rando1, rando1 + 2);
    res.render('index', { title: 'Home', prod1, prod2 });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/product', paginatedResults(Product), (req, res) => {
    var prod = res.paginatedResults;
    console.log(prod);
    res.render('product', { title: 'Products', prod });
});

app.get('/account', (req, res) => {
    res.render('account', { title: 'Account' });
});
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Cart' });
});
app.get('/product-details', (req, res) => {
    res.render('product-details', { title: 'Product-details' });
});

// Admin Pages
app.get('/admin/modify', (req, res) => {
    res.render('admin/modify', { title: 'Modify', prod });
});

app.get('/admin/add', (req, res) => {
    res.render('admin/add', { title: 'Add New Products' });
});

app.post('/admin', (req, res) => {
    console.log(req.body);
    const product = new Product(req.body);

    product
        .save()
        .then((result) => {
            res.redirect('/admin/modify');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/admin/:id', (req, res) => {
    const id = req.params.id;
    res.render('admin/edit', { title: 'Edit your Meds' });
});

app.delete('/admin/:id', (req, res) => {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/admin/modify' });
        })
        .catch((err) => {
            console.log(err);
        });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

function paginatedResults(model) {
    return async(req, res, next) => {
        var page;
        var limit;
        if (req.query.page == undefined && req.query.limit == undefined) {
            page = 1;
            limit = 12;
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
}
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');

// express app
const app = express();

// listen for requests
app.set('view engine', 'ejs');
app.use(express.static('public'));

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
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 5,
    },
    {
        src: '/product-2.jpg',
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 4,
    },
    {
        src: '/product-3.jpg',
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 5,
    },
    {
        src: '/product-4.jpg',
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 4,
    },
    {
        src: '/product-5.jpg',
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 4,
    },
    {
        src: '/product-6.jpg',
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 5,
    },
    {
        src: '/product-7.jpg',
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 4,
    },
    {
        src: '/product-8.jpg',
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 5,
    },
    {
        src: '/product-9.jpg',
        price: '50$',
        name: 'CNF+ Tablets (120mg)',
        stars: 4,
    },
];
const prod = [];
var chunkSize = 4;
for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    prod.push(chunk);
}
console.log(prod);
//Routing
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', prod });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/product', paginatedResults(products), (req, res) => {
    var prod = res.paginatedResults;
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
    //const product = new Product(req.body) ;

    /*product.save()
        .then((result) => {
            res.redirect('/admin/products') ;
        })
        .catch((err) => {
            console.log(err) ;
        })*/
});

app.get('/admin/:id', (req, res) => {
    const id = req.params.id;
    res.render('admin/edit', { title: 'Edit your Meds' });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

function paginatedResults(model) {
    return (req, res, next) => {
        var page;
        var limit;
        if (req.query.page == undefined && req.query.limit == undefined) {
            page = 1;
            limit = 12;
        } else {
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
        }
        console.log(page + ' ' + limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        if (endIndex < model.length)
            results.next = {
                page: page + 1,
                limit: limit,
            };
        if (startIndex > 0)
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        results.results = model.slice(startIndex, endIndex);
        console.log(results);
        var products = results.results;
        const prod = [];
        var chunkSize = 4;
        for (let i = 0; i < products.length; i += chunkSize) {
            const chunk = products.slice(i, i + chunkSize);
            prod.push(chunk);
        }
        res.paginatedResults = prod;
        next();
    };
}
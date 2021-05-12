const express = require('express');

// express app
const app = express();

// listen for requests
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000);

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

//Routing
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', prod });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/product', (req, res) => {
    res.render('product', { title: 'Product', prod });
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
app.get('/admin-product', (req, res) => {
    res.render('admin-product', { title: 'Products-Admin', prod });
});

app.get('/admin/:id', (req, res) => {
    const id = req.params.id;
    res.render('admin-edit', { title: 'Edit your Meds' });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
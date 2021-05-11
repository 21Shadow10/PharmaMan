const express = require('express');

// express app
const app = express();

// listen for requests
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000);

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/product', (req, res) => {
    res.render('product', { title: 'product' });
});

app.get('/account', (req, res) => {
    res.render('account', { title: 'account' });
});
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'cart' });
});
app.get('/product-details', (req, res) => {
    res.render('product-details', { title: 'product-details' });
});
// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
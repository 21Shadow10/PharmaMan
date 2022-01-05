const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

exports.getModify = (req, res) => {
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
};

exports.getAddPage = (req, res) => {
    res.render('admin/add', { title: 'Add New Products', user: req.user });
};

exports.PostAddMedicine = (req, res) => {
    const image = req.body.src;
    var img = {
        data: fs.readFileSync(
            path.join(__dirname, '../', '/uploads', req.file.filename)
        ),
        contentType: 'image/png',
    };
    const neo = {
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        type: req.body.type,
        src: {
            data: img.data,
            contentType: img.contentType,
        },
    };
    const product = new Product(neo);

    product
        .save()
        .then((result) => {
            res.redirect('/admin/modify');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditMeds = (req, res) => {
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
};

exports.postEditMeds = (req, res) => {
    const id = req.params.id;
    const product = req.body;
    if (req.file) {
        var img = {
            data: fs.readFileSync(
                path.join(__dirname + '/uploads/' + req.file.filename)
            ),
            contentType: 'image/png',
        };
    }
    Product.findOne({ _id: id }, (err, foundObject) => {
        if (err) {
            console.log(err);
        } else {
            if (!foundObject) {
                res.status(404).render('404', { title: '404' });
            } else {
                foundObject.name = product.name;
                foundObject.price = product.price;
                foundObject.desc = product.desc;
                if (req.file) {
                    foundObject.src = {
                        data: img.data,
                        contentType: img.contentType,
                    };
                }
                foundObject.type = product.type;
                foundObject.save((err, updateObject) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(foundObject);
                        res.redirect('/admin/modify');
                    }
                });
            }
        }
    });
};

exports.deleteMeds = (req, res) => {
    const id = req.params.id;
    console.log(id);
    Product.findByIdAndDelete(id)
        .then((result) => {
            res.redirect('/admin/modify');
        })
        .catch((err) => {
            console.log(err);
        });
};
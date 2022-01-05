const fs = require('fs');
const path = require('path');

const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');

exports.getAccount = (req, res) => {
    res.render('account', { title: 'Account', user: req.user });
};

exports.postAccount = (req, res) => {
    const user = req.user;
    const image = req.body.image;
    var img = {
        data: fs.readFileSync(
            path.join(__dirname, '../', '/uploads', req.file.filename)
        ),
        contentType: 'image/png',
    };
    user.image.data = img.data;
    user.image.contentType = img.contentType;
    user.save();
    res.redirect('/account');
};

exports.postAccountEdit = (req, res) => {
    user = req.user;
    user.address = req.body.address;
    user.phone = req.body.phone;
    user.save();
    res.redirect('/account');
};

exports.getLogin = (req, res) => res.render('login');

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
};

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.PostRegister = (req, res) => {
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
};

exports.getLogout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
};
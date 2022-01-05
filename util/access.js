exports.accessFunc = (req, res, next) => {
    message =
        '404\nYou are not Authorised to access this page! \nPlease go back to Home page';
    if (!req.user.admin)
        res.status(404).render('404', { title: '404', user: req.user, message });
    else next();
};
exports.get404 = (req, res) => {
    message = 'OOPS, page not found :)';
    res.status(404).render('404', { title: '404', user: req.user, message });
};
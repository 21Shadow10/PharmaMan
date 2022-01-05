const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: path.join(__dirname, '../', '/uploads'),
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + '_' + Date.now() + path.extname(file.originalname)
        );
    },
});

exports.upload = multer({ storage: storage });
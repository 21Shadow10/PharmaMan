const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    rating: {
        type: Number,
        default: 3,
    },
    desc: {
        type: String,
    },
    type: {
        type: String,
    },
    src: {
        data: Buffer,
        contentType: String,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    src: { type: String, required: true },
    name: { type: String, required: true },
    price: {
        type: float,
        required: true,
    },
    rating: {
        type: number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
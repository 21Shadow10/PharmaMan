const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    _productid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    quantity: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
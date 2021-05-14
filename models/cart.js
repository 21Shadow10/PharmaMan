const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    _productid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Product',
    },
    username: { type: String, required: true },
    quantity: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
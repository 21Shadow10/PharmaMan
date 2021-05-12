const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    productid: { type: String, required: true },
    username: { type: String, required: true },
    quantity: {
        type: number,
        required: true,
    },
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
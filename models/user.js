const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
*/



const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: 1234567890
    },
    address: {
        type: String,
        default: "12, Wharf Street, London, UK"
    },
    image: {
        data: Buffer,
        contentType: String
    },
    admin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
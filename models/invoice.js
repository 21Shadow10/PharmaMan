const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
	{
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
		date: {
			type: Date,
			default: Date.now(),
		},
		status: {
			type: Boolean,
			default: false,
		},
		rating: {
			type: Number,
		},
	},
	{ timestamps: true }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;

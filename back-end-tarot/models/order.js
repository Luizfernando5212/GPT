var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema(
    {
        quantidade: { type: Number, required: true },
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        orderId: { type: String, required: true }, // Stripe order id,
        status: { type: String, required: true }, // Stripe order status
        order: { type: String, required: true }, // Stripe order object
    }
)

OrderSchema.virtual('url').get(function() {
    return '/catalog/order' + this._id;
});

module.exports = mongoose.model('Order', OrderSchema)
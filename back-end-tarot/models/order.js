var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema(
    {
        quantidade: { trype: Number, required: true },
        usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    }
)

OrderSchema.virtual('url').get(function() {
    return '/catalog/order' + this._id;
});

module.exports = mongoose.model('Order', OrderSchema)
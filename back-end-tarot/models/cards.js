var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardsSchema = new Schema(
    {
        name: {type: String, required: true, max: 100, unique: true},
        img: {data: Buffer, contentType: String},
        imgName: {type: String, max: 100, unique: true},
    }
)

module.exports = mongoose.model('Card', CardsSchema);
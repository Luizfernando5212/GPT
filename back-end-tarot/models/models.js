var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ModelsSchema = new Schema(
    {
        name: {type: String, required: true, max: 100, unique: true},
        img: {data: Buffer, contentType: String}
    }
)

module.exports = mongoose.model('Model', ModelsSchema);
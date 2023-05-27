const Model = require('../models/models');
var fs = require('fs');


exports.getModels = async (req, res) => {
    try {
        const models = await Model.find();
        res.json(models);
    } catch (err) {
        console.log(err);
    }
}

exports.getModelById = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id)
        res.render('imagepage', { items: model });
        // res.json(model);
    } catch (err) {
        console.log(err);
    }
}

exports.insertModel = async (req, res) => {
    try {

        var model = {
            name: req.body.name,
            // img: {
            //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            //     contentType: 'image/png'
            // }
        }

        const { ...job } = req.body;

        const response = await Model.create(model);
        res.json(response);
    } catch (err) {
        console.log(err);
    }
}

exports.updateModel = async (req, res) => {
    try {
        var model = {
            name: req.body.name,
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        }

        const response = await Model.findByIdAndUpdate(req.params.id, model);

        res.json(response);

    } catch (err) {
        console.log(err);
    }
}

exports.deleteModel = async (req, res) => {
    try {
        const response = await Model.findByIdAndDelete(req.params.id);
        res.json(response);
    } catch (err) {
        console.log(err);
    }
}
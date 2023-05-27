const Card = require('../models/cards');
var fs = require('fs');


exports.getCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (err) {
        console.log(err);
    }
}

exports.getCardById = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id)
        res.render('imagepage', { items: card });
        // res.json(model);
    } catch (err) {
        console.log(err);
    }
}

exports.insertCard = async (req, res) => {
    try {

        var card = {
            name: req.body.name,
            // img: {
            //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            //     contentType: 'image/png'
            // }
        }

        const response = await Card.create(card);
        res.json(response);
    } catch (err) {
        console.log(err);
    }
}

exports.updateCard = async (req, res) => {
    try {
        var card = {
            name: req.body.name,
            // img: {
            //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            //     contentType: 'image/png'
            // }
        }

        const response = await Card.findByIdAndUpdate(req.params.id, card);

        res.json(response);

    } catch (err) {
        console.log(err);
    }
}

exports.deleteCard = async (req, res) => {
    try {
        const response = await Card.findByIdAndDelete(req.params.id);
        res.json(response);
    } catch (err) {
        console.log(err);
    }
}
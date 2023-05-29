const Card = require('../models/cards');
var fs = require('fs');

var x;

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

exports.sorteioCartas = async (req, res) => {
    try {
        const numCartas = req.params.num;
        const cards = await Card.find();

        console.log(numCartas)

        let arcanosMaiores = cards.slice(0, 22);
        let arcanosMenores = cards.slice(22)
        let cartasMaiores = [];
        let cartasMenores = [];

        if (numCartas <= 5) {
            while (cartasMaiores.length < numCartas) {
                let i = Math.floor(Math.random() * 22);

                if (!cartasMaiores.includes(arcanosMaiores[i].name)) {
                    cartasMaiores.push(arcanosMaiores[i].name);
                }
            }
            res.status(200).json({ maiores: cartasMaiores });
            return;
        } else {
            while (cartasMaiores.length < numCartas/2 && cartasMenores < numCartas/2) {
                let i = Math.floor(Math.random() * 22);
                let j = Math.floor(Math.random() * 22);

                if (!cartasMaiores.includes(arcanosMaiores[i].name) && cartasMaiores.length < numCartas/2) {
                    cartasMaiores.push(arcanosMaiores[i].name);
                }
    
                if (!cartasMenores.includes(arcanosMenores[j].name) && cartasMenores.length < numCartas/2) {
                    cartasMenores.push(arcanosMenores[j].name);
                }
            }
            res.status(200).json({ maiores: cartasMaiores, menores: cartasMenores });
        }
    } catch (err) {
        console.log(err);
    }
}
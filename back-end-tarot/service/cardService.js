const Card = require('../models/cards');
// const puppeteer = require('puppeteer');
// const svg = require('../util/svgDict');
const b = require('../util/boards');
const svg2img = require('svg2img');
const { convert } = require('convert-svg-to-png');


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
        // res.render('imagepage', { items: card });
        res.json(card);
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

        if (numCartas <= 5 || (numCartas % 2) === 1) {
            let num = numCartas <= 10 ? numCartas : 10;
            while (cartasMaiores.length < num) {
                let i = Math.floor(Math.random() * 22);

                if (!cartasMaiores.includes(arcanosMaiores[i].name)) {
                    cartasMaiores.push(arcanosMaiores[i].name);
                }
            }
            res.status(200).json({ maiores: cartasMaiores });
            return;
        } else {
            while (cartasMaiores.length < numCartas / 2 || cartasMenores < numCartas / 2) {
                let i = Math.floor(Math.random() * 22);
                let j = Math.floor(Math.random() * 22);

                if (!cartasMaiores.includes(arcanosMaiores[i].name) && cartasMaiores.length < numCartas / 2) {
                    cartasMaiores.push(arcanosMaiores[i].name);
                }

                if (!cartasMenores.includes(arcanosMenores[j].name) && cartasMenores.length < numCartas / 2) {
                    cartasMenores.push(arcanosMenores[j].name);
                }
            }
            console.log(cartasMaiores, cartasMenores)
            res.status(200).json({ maiores: cartasMaiores, menores: cartasMenores });
        }
    } catch (err) {
        console.log(err);
    }
}

exports.boardNew = async (req, res) => {
    // try {
    //     const browser = await puppeteer.launch({
            
    //     });
    //     const page = await browser.newPage();
    //     page.setViewport({ width: 682, height: 565 });

    //     const url = 'https://tarotai.onrender.com';

    //     const parameters = req.path.replace('/image/', 'board/');

    //     console.log(parameters)

    //     await page.goto(`${url}/card/${parameters}`, {
    //         waitUntil: 'networkidle2'
    //     });

    //     page.on('error', err => {
    //         console.error('err', err, err.stack)
    //         browser.close();
    //         res.status(500).end(err);
    //     });

    //     await page.evaluateHandle('document.fonts.ready');

    //     const image = await page.screenshot({
    //         fullPage: true,
    //     });

    //     await browser.close();

    //     res.setHeader('Content-Type', 'image/png');

    //     res.status(200).send(image);
    // } catch (err) {
    //     console.log(err);
    // }
}

exports.boardCard = async (req, res) => {
    try {
        let board;
        // const images = {
        //     naruto: 'https://tarotai.onrender.com/a01.jpg',
        //     sasuke: 'https://tarotai.onrender.com/a02.jpg',
        // }
        // console.log(req.path)
        // const data
        // console.log({params: req.params,
        //             path: req.path,
        //             url: req.url,})
        const parameters = req.path.split('/');
        parameters.splice(0, 2);

        const metodo = parameters[parameters.length - 1];

        // console.log({
        //     images,
        //     parameters,
        //     possible: images[parameters[0]],
        //     firstParameter: parameters[0],
        //     lastParameter: parameters[parameters.length - 1],
        //     req: req.path
        // });

        switch (metodo) {
            case 'm1': board = b.espelhoAmor(parameters); break;
            case 'm2': board = b.cruzCelta(parameters); break;
            case 'm3': board = b.peladan(parameters); break;
            case 'm4': board = b.tres(parameters); break;
            default: console.log('metodo não encontrado'); break;
        }

        // res.setHeader('Content-Type', 'image/svg+xml');
        // res.status(200).send(board);
        const png = await convert(board);
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(png);
    
        // svg2img(board, function (error, buffer) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         // console.log('buffer', buffer)
        //         let b64 = buffer.toString('base64');
        //         // console.log(b64)
        //         res.setHeader('Content-Type', 'image/png');
        //         // console.log()
        //         res.status(200).send(b64);
        //         // res.end(buffer);
        //     }
        // });


        // const board = `<svg width="682" height="565" viewBox="0 0 682 565" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        // <rect width="682" height="565" fill="white"/>
        // <rect x="62" y="45" width="134" height="219" fill="url(#pattern0)"/>
        // <rect x="274" y="45" width="134" height="219" fill="url(#pattern1)"/>
        // <rect x="470" y="45" width="134" height="219" fill="url(#pattern2)"/>
        // <rect x="274" y="299" width="134" height="219" fill="url(#pattern3)"/>
        // <defs>
        // <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        // <use xlink:href="#image0_1_2" transform="matrix(0.0255364 0 0 0.015625 -0.317164 0)"/>
        // </pattern>
        // <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
        // <use xlink:href="#image0_1_3" transform="matrix(0.0255364 0 0 0.015625 -0.317164 0)"/>
        // </pattern>
        // <pattern id="pattern2" patternContentUnits="objectBoundingBox" width="1" height="1">
        // <use xlink:href="#image0_1_4" transform="matrix(0.0255364 0 0 0.015625 -0.317164 0)"/>
        // </pattern>
        // <pattern id="pattern3" patternContentUnits="objectBoundingBox" width="1" height="1">
        // <use xlink:href="#image0_1_5" transform="matrix(0.0255364 0 0 0.015625 -0.317164 0)"/>
        // </pattern>
        // <image id="image0_1_2" width="64" height="64" xlink:href="${svg['a01']}"/>
        // <image id="image0_1_3" width="64" height="64" xlink:href="${images[parameters[1]]}"/>
        // <image id="image0_1_4" width="64" height="64" xlink:href="${images[parameters[0]]}"/>
        // <image id="image0_1_5" width="64" height="64" xlink:href="${images[parameters[1]]}"/>
        // </defs>
        // </svg>`;


        // res.setHeader('Content-Type', 'image/svg+xml');
        // res.setHeader('Content-Type', 'image/png');
        // res.send(board);
        // res.send(pixelArray);
    } catch (err) {
        console.log(err)
    }

}

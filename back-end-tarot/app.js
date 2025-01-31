require('dotenv').config();
var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var bodyParser = require('body-parser');

const conn = require('./connection/db');

var modelRouter = require('./routes/model');
var cardRouter = require('./routes/card');
var userRouter = require('./routes/user');
var aiRouter = require('./routes/ai');
var stripeRouter = require('./routes/stripe');
var whatsRouter = require('./routes/whats');
var orderRouter = require('./routes/order');

var app = express();
const PORT = process.env.PORT || 3000

// app.use(logger('dev'));

app.use('/stripe', bodyParser.raw({type: 'application/json'}), stripeRouter) // Exception for stripe webhook

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('images'));

// Routers
app.use('/model', modelRouter);
app.use('/card', cardRouter);
app.use('/user', userRouter);
app.use('/ai', aiRouter);
app.use('/whatsapp', whatsRouter)
app.use('/order', orderRouter)

conn().then(()=> {
    app.listen(PORT, () => {
        console.log('listening for requests')
    })
})


module.exports = app;

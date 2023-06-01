require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const axios = require('axios');
const request = require('../util/requestBuilder');

const fulfillOrder = async (session) => {
    const precoUnitario = 2;
    const order = {};

    order.quantidade = (session.amount_total / 100) / precoUnitario;
    order.orderId = session.id;
    order.status = session.payment_status;
    order.order = JSON.stringify(session);
    const user = await axios(request.getUser(session.customer_details.phone.trim('+')));
    order.user = user.data._id;
    // TODO: fill me in
    // userController.updateUser()
    await axios(request.insertOrder(order.orderId, order, phone))
    await axios(request.updateTokens(user.phone, order.quantidade))
    console.log("Fulfilling order", typeof session, session);
}

const createOrder = async (session) => {
    const precoUnitario = 2;
    const order  = {};

    order.quantidade = (session.amount_total / 100) / precoUnitario;
    order.orderId = session.id;
    order.status = session.payment_status;
    order.order = JSON.stringify(session);
    const user = await axios(request.getUser(session.customer_details.phone.trim('+')));
    order.user = user.data._id;

    await axios(request.insertOrder(order, phone));
    // TODO: fill me in
    console.log("Creating order", session);
}

const emailCustomerAboutFailedPayment = (session) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: '',
        to: session.customer_details.email,
        subject: 'Payment failed',
        text: 'Your payment failed. Please try again' // html para formatar o email
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error occurs', err);
        } else {
            console.log('Email sent!!!');
        }
    });
    // TODO: fill me in
    console.log("Emailing customer", session);
}

exports.webHook = async (req, res) => {
    const payload = req.body;
    let sig = req.headers['stripe-signature'];
    // sig = sig[0].trim() + sig[1].trim();
    // console.log('teste')

    // console.log(req.headers)

    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SK)
    } catch (err) {
        return res.status(401).send(`Webhook Error: ${err.message}`);
    }
    // console.log(event)
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            // Save an order in your database, marked as 'awaiting payment'
            createOrder(session);
            // console.log(session)
            // Check if the order is paid (for example, from a card payment)
            //
            // A delayed notification payment will have an `unpaid` status, as
            // you're still waiting for funds to be transferred from the customer's
            // account.
            // console.log('helo')
            if (session.payment_status === 'paid') {
                fulfillOrder(session);
            }

            break;
        }

        case 'checkout.session.async_payment_succeeded': {
            const session = event.data.object;
            // console.log(session)
            // Fulfill the purchase...
            fulfillOrder(session);

            break;
        }

        case 'checkout.session.async_payment_failed': {
            const session = event.data.object;
            // console.log(session)
            // Send an email to the customer asking them to retry their order
            emailCustomerAboutFailedPayment(session);

            break;
        }

        case '': {

        }
    }

    console.log("Got payload: " + payload);

    res.status(200).end();
}
require('dotenv').config();
const userController = require('../controller/userController');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const fulfillOrder = (lineItems) => {
    // TODO: fill me in
    userController.updateUser()
    console.log("Fulfilling order", lineItems);
}

const createOrder = (session) => {
    // TODO: fill me in
    console.log("Creating order", session);
}

const emailCustomerAboutFailedPayment = (session) => {
    // TODO: fill me in
    console.log("Emailing customer", session);
}

exports.webHook = async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    console.log('teste')

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SK)
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            // Save an order in your database, marked as 'awaiting payment'
            createOrder(session);

            session.paymeny_status = 'paid';

            // Check if the order is paid (for example, from a card payment)
            //
            // A delayed notification payment will have an `unpaid` status, as
            // you're still waiting for funds to be transferred from the customer's
            // account.
            console.log('helo')
            if (session.payment_status === 'paid') {
                fulfillOrder(session);
            }

            break;
        }

        case 'checkout.session.async_payment_succeeded': {
            const session = event.data.object;

            // Fulfill the purchase...
            fulfillOrder(session);

            break;
        }

        case 'checkout.session.async_payment_failed': {
            const session = event.data.object;

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
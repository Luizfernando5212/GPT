require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const axios = require('axios');
const request = require('../util/requestBuilder');
const variables = require('../util/variables');

const fulfillOrder = async (session) => {
    console.log('Finalizando pedido')
    const precoUnitario = 2;
    const order = {};
    const phone = session.customer_details.phone.replace(/^\+|\+$/g, '');

    order.quantidade = (session.amount_total / 100) / precoUnitario;
    order.orderId = session.id;
    order.status = session.payment_status;
    order.order = JSON.stringify(session);

    // TODO: fill me in
    // userController.updateUser()
    try {
        await axios(request.updateOrder(order.orderId, order, phone))
        const response = await axios(request.updateTokens(phone, order.quantidade))
    } catch (err) {
        console.log(err)
    }

    try {
        let response = await axios(request.getUser(phone));
        let botoes = []
        await axios(request.textMessage(phone, `Pagamento concluído com sucesso! Você comprou ${order.quantidade} estrelas. Seu saldo atual é de ${response.data.tokens} estrelas.`))
        await axios(request.textMessage(phone, `Estou muito feliz em continuar com você! Agora vamos nos preparar novamente para abrirmos uma nova mesa 🔮`));
        for (let metodo in variables.metodos) {
            if (response.data.tokens >= variables.metodos[metodo]) {
                botoes.push(variables.metodos[metodo])
            }
        }
        await axios(request.interactiveListMessage(phone, 'Qual consulta você deseja realizar agora ?', botoes, 100))
        // if (response.data.tokens)
        // await axios(request.in)
    } catch (err) {
        console.log(err)
    }

    // console.log("Fulfilling order", typeof session, session);
}

const createOrder = async (session) => {
    console.log('Criando pedido')
    // console.log(session)
    const precoUnitario = 2;
    const order = {};
    const phone = session.customer_details.phone.replace(/^\+|\+$/g, '');

    order.quantidade = (session.amount_total / 100) / precoUnitario;
    order.orderId = session.id;
    order.status = session.payment_status;
    order.order = JSON.stringify(session);

    try {
        const response = await axios(request.insertOrder(order, phone));
    } catch (err) {
        console.log(err)
    }
}

const emailCustomerAboutFailedPayment = (session) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'luiz.5.2.1.luiz@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: 'luiz.5.2.1.luiz@gmail.com',
        to: session.customer_details.email,
        subject: 'Payment failed',
        html: '<h1>Your payment failed. Please try again</h1>' // html para formatar o email
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

    // console.log("Got payload: " + payload);

    res.status(200).end();
}
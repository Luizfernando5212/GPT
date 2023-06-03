const Order = require('../models/order');
const User = require('../models/user');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        console.log(err);
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        res.json(order);
    } catch (err) {
        console.log(err);
    }
}

exports.insertOrder = async (req, res) => {
    try {
        const { ...order } = req.body.order;
        const user = await User.findOne({ phone: req.body.phone });
        order.user = user._id;
        const response = await Order.create(order);
        res.json(response);
    } catch (err) {
        console.log(err);
    }
}

exports.updateOrder = async (req, res) => {
    try {
        console.log('uodate')
        const { ...order } = req.body.order;
        const user = await User.findOne({ phone: req.body.phone });
        order.user = user._id;
        const response = await Order.findOneAndUpdate({ orderId: req.params.id }, order);

        res.json(response);

    } catch (err) {
        console.log(err);
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const response = await Order.findByIdAndDelete(req.params.id);
        res.json(response);
    } catch (err) {
        console.log(err);
    }
}


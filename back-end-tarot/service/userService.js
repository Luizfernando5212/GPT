const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyUser = async (req, res) => {
    const { username, password } = req.body;

    const alg = { algorithm: 'HS256' };

    var message = 'Invalid User/password.';
    const user = await User.findOne({ username: username });

    try {
        console.log(password)
        if (await user.comparePassword(password)) {
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, alg);
            req.session.token = token
            res.json({ token });
        } else {
            res.status(401).json({ message: message })
        }
    } catch (err) {
        res.status(401).json()
    }
}

exports.verifyUserByPhone = async (req, res) => {
    const { phone } = req.body;

    try {
        const user = await User.findOne({ phone: phone });
        console.log(user);

        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Invalid phone number.' })
    }
}

exports.getUsers = async (req, res) => {
    console.lof(req)
    try {
        const users = await User.find();
        console.log(users)
        res.json(users);
    } catch (err) {
        console.log(err);
    }
}

exports.newUser = async (req, res) => {
    try {
        const { username, password, phone } = req.body;
        var user = new User({
            username: username,
            password: password,
            phone: phone
        })

        const response = await user.save();

        res.json(response);
    } catch (err) {
        console.log(err);
    }
}

exports.updadeUser = async (req, res) => {
    try {
        const { user } = req.body;
        const oldUser = await User.findById(user.id);

        oldUser.tokens += user.tokens;

        const response = await User.findByIdAndUpdate(user.id, oldUser);

        res.json(response);

    } catch (err) {
        console.log(err);
    }

}
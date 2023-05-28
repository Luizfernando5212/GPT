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

exports.getUserByPhone = async (req, res) => {
    // const phone = req.body;
    const phone = req.params.phone;

    try {
        const user = await User.findOne({ phone: phone });

        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Invalid phone number.' })
    }
}

exports.getUsers = async (req, res) => {
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
        if (req.body.password && req.body.username && req.body.phone) {
            const { username, password, phone } = req.body;
            var user = new User({
                username: username,
                password: password,
                phone: phone
            })

            const response = await user.save();
            res.json(response);
        } else {
            const { username, phone } = req.body;
            var user = new User({
                username: username,
                phone: phone
            })

            const response = await user.save();
            res.json(response);
        }
    } catch (err) {
        console.log(err);
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user  = {
            tokens: req.body.tokens
        }
        console.log(user)
        const oldUser = await User.findById(req.params.id);

        oldUser.tokens += user.tokens;

        const response = await User.findByIdAndUpdate(req.params.id, oldUser);

        res.json(response);

    } catch (err) {
        console.log(err);
    }

}
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../_models/User');
const sendEmail = require("../utils/email");

exports.loginOrSignup = (req, res, next) => {

    const email = req.body.email;
    // create a 6 digits random code
    const code = Math.floor(100000 + Math.random() * 900000);

    User.findOne({ email: email })
        .then(user => {
            // if user does not exist, create a new user and send email code
            if (!user) {
                const user = new User({
                    email: email,
                    code: code,
                });

                user.save()
                    .then(() => {
                        sendEmail(user.email, "Code de verification", `Votre code de vérification est ${code}.`)
                            .then(() => {
                                res.status(201).json({ message: 'signup' });
                            })
                            .catch(error => res.status(400).json({ error: 'Email not sent' }));
                    })
                    .catch(error => res.status(400).json({ error: 'Email already used' }));
            }
            // if user exists, send email code and add it to the user
            else {
                sendEmail(user.email, "Code de verification", `Votre code de vérification est ${code}.`)
                    .then(() => {
                        user.code = code;
                        // update user code
                        User.findOneAndUpdate(
                            { email: email },
                            { code: code })
                            .then((user) => {
                                if (user.verified && user.firstname) {
                                    res.status(201).json({ message: 'login' });
                                }
                                else {
                                    res.status(201).json({ message: 'signup' });
                                }
                            })
                            .catch(error => res.status(400).json({ error: 'Email not sent' }));
                    })
                    .catch(error => res.status(400).json({ error: 'Email not sent' }));
            }
        })
        .catch(error => res.status(500).json({ error: 'Internal Error' }));
};



exports.verifyEmailCode = (req, res, next) => {

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Not Found' });
            }
            if (user.code != req.body.code) {
                return res.status(401).json({ error: 'Wrong Code' });
            }
            User.findOneAndUpdate(
                { email: req.body.email },
                { verified: true })
                //{ new: true })
                .then((user) => {
                    res.status(201).json({ message: 'Code verified', type: user.type });
                })
                .catch(error => res.status(400).json({ error: 'Not Found' }));
        })
        .catch(error => res.status(500).json({ error: 'Internal Error' }));
};


exports.getUserByEmail = (req, res, next) => {

    User.findOne({ email: req.params.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Not Found' });
            }
            res.status(201).json(user);
        })
        .catch(error => res.status(400).json({ error: 'Not Found' }));
};

exports.getUserById = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error: 'Not Found' }));
}

exports.getAllAgents = (req, res, next) => {
    console.log('getAllAgents');
    User.find({ type: '1' })
        .then(users => {
            if (!users) {
                return res.status(401).json({ error: 'Not Found' });
            }
            res.status(201).json(users);
        })
        .catch(error => res.status(400).json({ error: 'Not Found' }));
}


exports.updateUser = (req, res, next) => {
    // remove _id from req.body.user
    delete req.body.user._id;
    console.log(req.body.user);

    User.findOneAndUpdate(
        { email: req.body.user.email },
        { ...req.body.user })
        //{ new: true })
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: 'Not Found' })
        });
}

exports.uploadPicture = (req, res, next) => {
    console.log('cooucouuuuu', req.file);
    User.findOneAndUpdate(
        { email: req.params.email },
        { imageUrl: req.file.filename },
        { new: true })
        .then((user) => res.status(200).json(user))
        .catch(error => res.status(400).json({ error: 'Not Found' }));

};
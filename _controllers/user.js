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
                                console.log(user);
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
                .then(() => {
                    res.status(201).json({ message: 'Code verified' });
                })
                .catch(error => res.status(400).json({ error: 'Not Found' }));
        })
        .catch(error => res.status(500).json({ error: 'Internal Error' }));
};


exports.updateUser = (req, res, next) => {
    // remove _id from req.body.user
    delete req.body.user._id;

    console.log(req.body.user);

    User.findOneAndUpdate(
        { email: req.body.user.email },
        { ...req.body.user },
        { new: true })
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: 'Not Found' })
        });
}



const { get } = require('http');
const fs = require('fs');
const Conversation = require('../_models/Conversation');
const e = require('express');
const User = require('../_models/User');
const sendEmail = require('../utils/email');


exports.getConv = (req, res, next) => {

    const participants = [req.params.senderId, req.params.receiverId];
    Conversation.findOne({
        participants: { $all: participants, $size: participants.length }
    })
        .then(conv => {
            if (conv) {
                res.status(200).json(conv);
            } else {
                res.status(404).json({ message: 'Conversation not found' });
            }
        })
        .catch(error => res.status(400).json({ error }));
}

exports.getUserConvs = (req, res, next) => {
    Conversation.find({ participants: req.params.userId })
        .then(convs => {
            if (convs) {
                res.status(200).json(convs);
            } else {
                res.status(404).json({ message: 'Conversations not found' });
            }
        })
        .catch(error => res.status(400).json({ error }));
}

exports.getFriendsConvs = (req, res, next) => {
    Conversation.find({ participants: req.params.userId })
        .then(convs => {
            if (convs) {
                res.status(200).json(convs);
            } else {
                res.status(404).json({ message: 'Conversations not found' });
            }
        })
        .catch(error => res.status(400).json({ error }));
}

exports.readConv = (req, res, next) => {
    Conversation.findByIdAndUpdate(req.params.convId, { read: true })
        .then(() => {
            res.status(200).json({ message: 'Conversation read' });
        })
        .catch(error => res.status(400).json({ error }));
}

exports.sendMessage = async (req, res, next) => {
    const message = req.body;
    // Rechercher une conversation existante avec les participants
    let conversation = await Conversation.findOne({
        participants: { $all: message.participants, $size: message.participants.length }
    });

    if (!conversation) {
        // Si aucune conversation n'existe, en créer une nouvelle
        conversation = new Conversation({
            participants : message.participants,
        });
        // puis on les ajoute en amis
        let user1 = await User.findOne({ _id: message.participants[0] })
        let user2 = await User.findOne({ _id: message.participants[1] })

        user1.friends.push({
            _id: user2._id,
            firstname: user2.firstname,
            lastname: user2.lastname,
            email: user2.email,
        });
        user2.friends.push({
            _id: user1._id,
            firstname: user1.firstname,
            lastname: user1.lastname,
            email: user1.email,
        });

        await user1.save();
        await user2.save();
    }

    // Ajouter le message à la conversation
    const newMessage = { 
        senderId: message.senderId, 
        text : message.text, 
        date: new Date() 
    };
    conversation.messages.push(newMessage);
    conversation.read = false;
    conversation.lastUpdated = new Date();

    // Enregistrer la conversation
    await conversation.save();

    // send notification
    message.participants.forEach(participant => {
        /*if (participant !== message.senderId) {
            sendNotification(req, { toUserId: participant, ...newMessage });
        }*/
            //const io2 = req.app.get('socketIO');
            //io2.emit(participant, message);
            console.log('message sent to', participant);
    });
}

exports.reportConv = (req, res, next) => {
    sendEmail(process.env.USERMAIL, 'Signalement', 
        'La conversation ' + req.body.convId + ' a été signalée par l\'utilisateur ' + req.body.userId
        + '(' + req.body.firstname + ' ' + req.body.lastname + ')')
    .then(() => {
        res.status(200).json({ message: 'Conversation reported' });
    })
    .catch(error => res.status(400).json({ error }));
}
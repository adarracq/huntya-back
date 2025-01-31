const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Event = require('../_models/Event');

exports.getEventsByUserEmail = (req, res, next) => {
    Event.find(
        {
            $or: [
                { 'asker.email': req.params.email },
                { 'guests.email': req.params.email }

            ]
        })
        .then(events => res.status(200).json(events))
        .catch(error => res.status(404).json({ error: 'Not Found' }));
}

exports.getEventById = (req, res, next) => {
    Event.findOne({ _id: req.params.id })
        .then(event => res.status(200).json(event))
        .catch(error => res.status(404).json({ error: 'Not Found' }));
}

exports.createEvent = (req, res, next) => {
    const event = new Event({ ...req.body });
    event.save()
        .then(() => { res.status(201).json({ message: 'Success' }) })
        .catch(error => { res.status(400).json({ error }) })
}

exports.updateEvent = (req, res, next) => {
    Event.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body })
        .then((event) => res.status(200).json(event))
        .catch(error => res.status(400).json({ error: 'Not Found' }));
};

exports.deleteEvent = (req, res, next) => {
    Event.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Deleted' }))
        .catch(error => res.status(400).json({ error: 'Not Found' }));
};
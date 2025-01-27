const Zone = require('../_models/Zone');

exports.getAll = (req, res, next) => {
    Zone.find()
        .then(zones => res.status(200).json(zones))
        .catch(error => res.status(400).json({ error }));
}

exports.create = (req, res, next) => {
    const zone = new Zone({ ...req.body });
    zone.save()
        .then(() => { res.status(201).json({ message: 'Success' }) })
        .catch(error => { res.status(400).json({ error }) })
}

exports.createMany = (req, res, next) => {
    Zone.insertMany(req.body)
        .then(() => { res.status(201).json({ message: 'Success' }) })
        .catch(error => { res.status(400).json({ error }) })
}


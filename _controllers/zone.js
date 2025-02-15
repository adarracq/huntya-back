const Zone = require('../_models/Zone');

exports.getAll = (req, res, next) => {
    Zone.find()
        .then(zones => res.status(200).json(zones))
        .catch(error => res.status(400).json({ error }));
}

exports.getMany = (req, res, next) => {
    let zonesCodes = [];
    req.body.forEach(zone => {
        zonesCodes.push(zone);
    });
    Zone.find({ code: { $in: zonesCodes } })
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

// ajoutes aux zones du body un agent/contact/projet
exports.addCAP = (req, res, next) => {
    const { zones, type } = req.body;
    zones.forEach(zone => {
        Zone.findOne({ code: zone })
            .then(zone => {
                if (type === 'agent') {
                    zone.nbAgents += 1;
                } else if (type === 'contact') {
                    zone.nbContacts += 1;
                } else if (type === 'project') {
                    zone.nbProjects += 1;
                }
                zone.save();
            })
    });
    res.status(201).json({ message: 'Success' });
}

exports.getZoneFromCoords = (req, res, next) => {
    const { latitude, longitude } = req.body;
   // we need to find if the coords are inside of a zone.contour
   // and if it is, we return the zone and update nbProjects from the zone
    // if it is not, we return an error message
    Zone.find()
        .then(zones => {
            const zone = zones.find(zone => {
                const contour = zone.contour;
                let isInside = false;
                for (let i = 0, j = contour.length - 1; i < contour.length; j = i++) {
                    const xi = contour[i][0], yi = contour[i][1];
                    const xj = contour[j][0], yj = contour[j][1];
                    const intersect = ((yi > latitude) != (yj > latitude)) && (longitude < (xj - xi) * (latitude - yi) / (yj - yi) + xi);
                    if (intersect) isInside = !isInside;
                }
                return isInside;
            });
            if (zone) {
                zone.nbProjects += 1;
                zone.save()
                    .then(() => res.status(200).json(zone.code))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.status(400).json({ message: 'Coords are not inside of any zone' });
            }
        })
        .catch(error => res.status(400).json({ error }));
}

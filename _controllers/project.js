const { get } = require('http');
const Project = require('../_models/Project');
const fs = require('fs');

exports.createProject = (req, res, next) => {
    const project = new Project({
        ...req.body
    });
    console.log(project);
    project.save()
        .then(() => { res.status(201).json({ message: 'Projet enregistré !' }) })
        .catch(error => { 
            console.log(error);
            res.status(400).json({ error }) 
        })
};

exports.getOneProject = (req, res, next) => {
    Project.findOne({
        _id: req.params.id
    }).then(
        (project) => {
            res.status(200).json(project);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.getAllProjectsByUser = (req, res, next) => {
    Project.find({ user_id: req.params.userId }).then(
        (projects) => {
            res.status(200).json(projects);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

exports.getProjectsInZones = (req, res, next) => {
    let zonesCodes = [];
    req.body.forEach(zone => {
        zonesCodes.push(zone.code);
    });
    Project.find({
        'zone.code': { $in: zonesCodes },
        isPublic: true
    }).then(
        (projects) => {
            res.status(200).json(projects);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

exports.modifyProject = (req, res, next) => {
    const projectObject = req.file ? {
        ...JSON.parse(req.body),
        imageUrl: `${req.protocol}://${req.get('host')}/_upload/images/${req.file.filename}`
    } : { ...req.body };

    Project.findOneAndUpdate({ _id: req.params.id }, { ...projectObject, _id: req.params.id })
        .then(() => { res.status(200).json({ message: 'Projet modifié !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.deleteProject = (req, res, next) => {
    Project.findOne({ _id: req.params.id })
        .then(project => {
            //if (project.userId != req.auth.userId) {
            //    res.status(401).json({ message: 'Not authorized' });
            //} else {
            //const filename = project.imageUrl.split('/_upload/images/')[1];
            //fs.unlink(`_upload/images/${filename}`, () => {
            Project.deleteOne({ _id: req.params.id })
                .then(() => { res.status(200).json({ message: 'Projet supprimé !' }) })
                .catch(error => res.status(401).json({ error }));
            //});
            //}
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getAllProjects = (req, res, next) => {
    Project.find().then(
        (projects) => {
            res.status(200).json(projects);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
const mongoose = require('mongoose');

const zoneSchema = mongoose.Schema({
    code: { type: String, required: true },
    nom: { type: String, required: true },
    contour: { type: [[Number]], required: true },
    centre: { type: [Number], required: true },
    population: { type: Number, required: true },
    departement: { type: String, required: true },
    region: { type: String, required: true },
    nbProjects: { type: Number, required: false, default: 0 },
    nbContacts: { type: Number, required: false, default: 0 },
});

module.exports = mongoose.model('Zone', zoneSchema);
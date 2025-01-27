const mongoose = require('mongoose');

const zoneSchema = mongoose.Schema({
    code: { type: String, required: true },
    nom: { type: String, required: true },
    contour: { type: [[Number]], required: true },
    centre: { type: [Number], required: true },
    population: { type: Number, required: true },
    departement: { type: String, required: true },
    region: { type: String, required: true }
});

module.exports = mongoose.model('Zone', zoneSchema);
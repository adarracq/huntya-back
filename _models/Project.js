const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    type: { type: Number, required: true }, // 0: achat 1: vente
    user_id: { type: String, required: true },
    user_firstname: { type: String, required: true },
    user_email: { type: String, required: true },
    date: { type: Date, required: true },
    categorie: { type: Number, required: true },
    nbRooms: { type: Number, required: false },
    nbBedrooms: { type: Number, required: false },
    nbBathrooms: { type: Number, required: false },
    surface: { type: Number, required: false },
    surfaceMin: { type: Number, required: false },
    surfaceMax: { type: Number, required: false },
    gardenSurface: { type: Number, required: false },
    gardenSurfaceMin: { type: Number, required: false },
    gardenSurfaceMax: { type: Number, required: false },
    surfaceExt: { type: Number, required: false },
    parking: { type: Number, required: false },
    budgetMin: { type: Number, required: false },
    budgetMax: { type: Number, required: false },
    description: { type: String, required: false },
    zone: { type: Object, required: false },
    address: { type: Object, required: false },
    addressString: { type: String, required: false },
    coords: { type: Object, required: false },
    status: { type: String, required: true },
    isPublic: { type: Boolean, required: true },
});

module.exports = mongoose.model('Project', projectSchema);
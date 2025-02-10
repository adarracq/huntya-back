const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    date: { type: Date, required: true },
    text: { type: String, required: true },
    senderId: { type: String, required: true },
    event: {type:Object, required: false},
    // image: { type: String, required: false },
    // video: { type: String, required: false },
    // audio: { type: String, required: false },
    // system: { type: Boolean, required: false },
    // sent: { type: Boolean, required: false },
    // received: { type: Boolean, required: false },
    // pending: { type: Boolean, required: false },
});


const convSchema = mongoose.Schema({
    participants: [String],  // Stocke les IDs des deux participants
    messages: { // Tableau de messages dans la conversation
        type: [messageSchema],
        default: [], // Cela permet de ne pas inclure de messages lors de la création
    },
    name: { type: String, required: false },
    image: { type: String, required: false },
    read: { type: Boolean, required: false },
    lastUpdated: { type: Date, required: false },
});

module.exports = mongoose.model('Conv', convSchema);
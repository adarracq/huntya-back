const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: Number, required: true },
    asker: { type: Object, required: true },
    guests: { type: [Object], required: false },
    description: { type: String, required: false },
    hourStart: { type: String, required: true },
    hourEnd: { type: String, required: true },
    status: { type: String, required: true }

});

module.exports = mongoose.model('Event', eventSchema);
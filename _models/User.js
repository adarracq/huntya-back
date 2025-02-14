const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const subscriptionSchema = mongoose.Schema({
    plan: { type: Number, required: false }, // premium or basic
    billing: { type: Number, required: false }, // monthly or yearly
    subscriptionDate: { type: Date, required: false },
    expirationDate: { type: Date, required: false },
    boosts: { type: [Date], required: false }, // array of expiration dates
    isBoosted: { type: Boolean, required: false },
    leadsLeft: { type: Number, required: false }, // array of expiration dates
});

const agentSchema = mongoose.Schema({
    workStatus: { type: Number, required: false }, // Salarié ou Indépendant
    network: { type: String, required: false },
    url: { type: String, required: false },
    notes: { type: [Number], required: false },
    specialities: { type: [Number], required: false },
    experience: { type: Number, required: false }, // in yearss
    zoneCodes: { type: [String], required: false },
    lastZoneUpdateDate: { type: Date, required: false },
    verifId: { type: String, required: false },
    badges: { type: [Number], required: false },
    subscription: { type: subscriptionSchema, required: false },
    maxZones: { type: Number, required: false },
});


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: Number, required: false },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    type: { type: String, required: false }, // user or agent
    birthdate: { type: String, required: false },
    gender: { type: Number, required: false },
    languages: { type: [Number], required: false },
    imageUrl: { type: String, required: false },
    presentation: { type: String, required: false },
    status: { type: String, required: false }, // verify, unverify, pending or banned
    verified: { type: Boolean, required: true, default: false },
    friends: { type: [Object], required: false },
    agentProperties: { type: agentSchema, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()

const app = express();

const projectRoutes = require('./_routes/project');
const userRoutes = require('./_routes/user');
const eventRoutes = require('./_routes/event');
mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/project', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/_upload/images', express.static(path.join(__dirname, '_upload/images')));



module.exports = app;
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()
const rateLimit = require('express-rate-limit');

const app = express();


const projectRoutes = require('./_routes/project');
const userRoutes = require('./_routes/user');
const eventRoutes = require('./_routes/event');
const zoneRoutes = require('./_routes/zone');
const convRoutes = require('./_routes/conv');

mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !' + error));

app.use(express.json());

// Set up rate limiter: maximum of 100 requests per 2 minutes per IP
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 2 minutes)
    message: "Too many requests from this IP, please try again after 15 minutes",
  });
  
// Apply the rate limiter to all requests
app.use(limiter);


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/project', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/zone', zoneRoutes);
app.use('/api/conv', convRoutes);
app.use('/_upload/images', express.static(path.join(__dirname, '_upload/images')));


module.exports = app;
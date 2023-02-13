const express = require('express');
//require('dotenv').config();
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


//Import le package pour utilisser les variables d'environnnement
const dotenv = require("dotenv");
const result = dotenv.config();


//Me connecter à mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME }:${process.env.DB_PASSWORD}@${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
mongoose.set('strictQuery', false);


/****************TOUT LES MIDDLEWARE**************/
app.use(express.json());
app.use(cors());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;
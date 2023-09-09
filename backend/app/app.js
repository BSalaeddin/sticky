const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config(); // Using .env file

const projectsRoutes = require('./routes/projects.routes');
const userRoutes = require('./routes/user.routes');

// Connexion to mongoDB
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const DATABASE_URL = 'mongodb://'
                    + process.env.DATABASE_USERNAME + ':'
                    + process.env.DATABASE_PASSWORD + '@'
                    + process.env.DATABASE_HOST + ':' 
                    + process.env.DATABASE_PORT + '/' 
                    + process.env.DATABASE_NAME ;

mongoose.connect(DATABASE_URL, { useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Connection failed! '+err);
});

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// Api routers
app.use('/api/projects', projectsRoutes);
app.use('/api/user',userRoutes);

module.exports = app;

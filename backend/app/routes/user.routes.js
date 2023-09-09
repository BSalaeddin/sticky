// Imports
const express = require('express');
const UserController = require('../controllers/users.controller');

const router = express.Router(); // Using express Router


/** POST /signup - Create a new user */
router.post('/signup', UserController.createUser);
/** POST /login - Authenticate a user */
router.post('/login', UserController.userLogin);

module.exports = router;

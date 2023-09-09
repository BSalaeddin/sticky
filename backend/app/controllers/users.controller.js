const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Create a new user
 */
exports.createUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10) // Hashing the password
    .then( hash => {
      // Create new user object
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // Save user to the database
      user.save()
      .then( result => {
        // Succeeded request
        res.status(201).json({
          message: 'User Created!',
          result: result
        })
      })
      .catch( err => {
        // Failed request
        res.status(500).json({
            message: 'Invalid authentication credentials!'
        });
      });
    });
}

exports.userLogin =  (req, res, next) => {
  let fetchedUser;
  // Find user from the database
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        // Failed request
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        });
      }
      fetchedUser = user;
      return bcrypt.compare( req.body.password, user.password) // Comparing passwords 
    })
    .then( result => {
      if(!result) {
        // Failed request
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        });
      }
      // Creating a token
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      },
      process.env.JWT_KEY, // getting JWT secret key from .env
      {expiresIn: '1h'} // Setting token Expiration duration 
      );
      // Succeeded request
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      // Failed request
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
      });
    });
}

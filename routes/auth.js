require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {
  //See if the e-mail is already in the database.
  User.findOne({email: req.body.email}, function(err, user) {
    if (user) {
    //Sending an error message the user 'email is taken'.
    res.status(401).json({
      error: true,
      message: "Email already exists."
    });
  } else {
    //If the email is not taken...
    //create the user in the database.
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }, function(err, user) {
      //check for any db errors
      if (err) {
        console.log("We have an error creating the user.");
        console.log(err);
        res.status(401).json(err);
      } else {
        //Log the user in (sign a new token)
        console.log("Just about to sign the token.");
        var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        })
        //Return user and token to React app
        res.json({user, token});
        }
      })
    }
  })
});

router.post('/login', (req, res) => {
    //look up user in the database.
  User.findOne({email: req.body.email}, function(err, user) {
    if (user) {
      //if there is a user...
      //check their entered password against the hash
      if (user.authenticated(req.body.password)) {
        //if it matches: log them in (sign a token)
        var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        });
        res.json({user, token});
      } else {
        //if it doesn't match: send an error
      res.status(401).json({
        error: true,
        message: 'Email or password is incorrect'
        });
      }
    }else{
      //if the user isn't in the database...
      res.status(401).json(err);
    }
  })
});

router.post('/me/from/token', (req, res) => {
  let token = req.body.token;
  //Check for the presence of a token.
  if (!token) {
  //They didn't send me a token.
    res.status(401).json({
      error: true,
      message: "You must pass a token."
  })
  } else {
  //We do have a token.
  //Validate the token.
  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      //if the token is invalid...
      //send an error, redirect to a login screen.
      res.status(401).json(err);
    } else {
      //If token is valid...
      //Look up the user in the db, based on the info in the token.
      User.findById(user._id, function(err, user) {
        if (err) {
          res.status(401).json(err);
        } else {
          //Send the user and the token back to the React app.
          res.json({user, token});
          }
        })
      }
    })
  }
});

module.exports = router;

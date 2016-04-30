var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var keys = require('./keys.js');


var app = express();

app.use(bodyParser.json());
app.use(session({secret: 'thunderb0lt'})); //This needs to come before initilizing session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: keys.facebookKey,
  clientSecret: keys.facebookSecret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function (token, refreshToken, profile, done) {
  return done(null, profile)
}))


//These are part of Passport-Sessions
passport.serializeUser(function(user, done) {
  //go to mongo get _id for user, put that on session
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  //Get data off of session (see serializeUser)
  done(null, obj);
  //Put it on req.user in EVERY ENDPOINT
});



// endpoints
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook',
{
  successRedirect: '/me',
  failureRedirect: '/login'
}))

app.get('/me', function (req, res, next) {
  res.send(req.user); //this will show us what deserialize put on user
})

app.listen(3000, function () {
  console.log('NSA is listening on port 3000');
})

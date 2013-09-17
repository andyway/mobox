var mongoose = require('mongoose'),
    oauth2orize = require('oauth2orize'),
    crypto = require('crypto'),
    UserModel = mongoose.model('User'),
    ClientModel = mongoose.model('Client'),
    AccessTokenModel = mongoose.model('AccessToken'),
    RefreshTokenModel = mongoose.model('RefreshToken'),
    passport = require('passport'),
    config = require('../config');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.clientCredentials({ userProperty: 'inject' }, function(injectedData, scope, done) {
  var user;

  if (!injectedData.user) { return done(null, false); }
  if (!injectedData.body.client_id || !injectedData.body.client_secret) { return done(null, false); }
  user = injectedData.user;

  ClientModel.findOne({ clientId: injectedData.body.client_id, clientSecret: injectedData.body.client_secret }, function(err, client) {
    
    RefreshTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
        if (err) return done(err);
    });
    AccessTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
        if (err) return done(err);
    });

    var tokenValue = crypto.randomBytes(32).toString('base64');
    var refreshTokenValue = crypto.randomBytes(32).toString('base64');
    var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user.userId });
    var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
    refreshToken.save(function (err) {
        if (err) { return done(err); }
    });
    var info = { scope: '*' }
    token.save(function (err, token) {
        if (err) { return done(err); }
        done(null, tokenValue, refreshTokenValue, { 'expires_in': config.security.tokenLife });
    });
  
  });
}));

// Exchange refreshToken for access token.

server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({ token: refreshToken }, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
        if (!token) { return done(null, false); }
        UserModel.findById(token.userId, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            RefreshTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
                if (err) return done(err);
            });
            AccessTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
                if (err) return done(err);
            });

            var tokenValue = crypto.randomBytes(32).toString('base64');
            var refreshTokenValue = crypto.randomBytes(32).toString('base64');
            var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user.userId });
            var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
            refreshToken.save(function (err) {
                if (err) { return done(err); }
            });
            var info = { scope: '*' }
            token.save(function (err, token) {
                if (err) { return done(err); }
                done(null, tokenValue, refreshTokenValue, { 'expires_in': config.security.tokenLife });
            });
        });
    });
}));

exports.decision = [
  function(req, res, done) { return done(null, req.user); },
  server.decision()
]

exports.token = [
    function(req, res, done) {
      if (!req.body || !req.body.client_id) {
        req.body = req.query;
      }
      if (req.user) {
        req.inject = { body: req.body, user: req.user };
        return done(null, req.user);
      }
      req.inject = {};
      return done(null, null, { message: 'Unknown user'});
    },
    server.token(),
    server.errorHandler()
]

var async = require('async');

module.exports = function(app, passport, auth, oauth2) {
  //User Routes
  var users = require('../app/controllers/users');

  //Setting up the users api
  var oauth_dummy = require('../app/controllers/oauth');
  app.get('/create-client', oauth_dummy.createClient);
  
  app.put('/users', users.create);
  app.get('/users/logout', users.logout);

  // Oauth token
  //app.post('/oauth/token', oauth2.token);
  app.get('/oauth/token', oauth2.token);
  app.get('/oauth/decision', oauth2.decision);
  
  
  app.get('/api/userInfo',
  passport.authenticate('bearer', { session: false }),
    function(req, res) {
      res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
    }
  );
  
  
  app.post('/users/me', passport.authenticate('local', { }), 
    function(req, res) {  
      res.json(req.user)
    }
  );

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  /*
  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/'
  }), users.authCallback);

  //Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
      failureRedirect: '/'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
      failureRedirect: '/'
  }), users.authCallback);

  //Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
      failureRedirect: '/'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/'
  }), users.authCallback);

  //Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
      failureRedirect: '/',
      scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
      ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
      failureRedirect: '/signin'
  }), users.authCallback);
  */

  app.param('userId', users.user);


  /**
  * Accounts routes
  * 
  */
  var accounts = require('../app/controllers/accounts');
  app.get('/accounts', accounts.all);
  app.put('/accounts', auth.requiresLogin, accounts.create);
  app.get('/accounts/:accountId', users.checkOwnership, accounts.show);
  app.post('/accounts/:accountId', auth.requiresLogin, users.checkOwnership, users.requireOwnership, accounts.update);
  app.del('/accounts/:accountId', auth.requiresLogin, users.checkOwnership, users.requireOwnership, accounts.destroy);

  app.put('/accounts/:accountId/access', auth.requiresLogin, users.checkOwnership, users.requireOwnership, users.getByUsername, accounts.addAccess);
  app.del('/accounts/:accountId/access', auth.requiresLogin, users.checkOwnership, users.requireOwnership, users.getByUsername, accounts.removeAccess);

  app.param('accountId', accounts.account);
  
  var currencies = require('../app/controllers/currencies');
  app.get('/currencies', currencies.all);
  
  /**
  * @todo - remove dummy function
  * 
  */
  app.get('/dummy/currency', currencies.dummy);

  
  /**
  * Projects routes
  * 
  */
  var projects = require('../app/controllers/projects');
  app.param('projectId', projects.project);
  
  app.get('/projects', projects.all);
  app.put('/projects', auth.requiresLogin, projects.create);
  app.get('/projects/:projectId', users.checkOwnership, projects.show);
  app.post('/projects/:projectId', auth.requiresLogin, users.checkOwnership, users.requireOwnership, projects.update);
  app.del('/projects/:projectId', auth.requiresLogin, users.checkOwnership, users.requireOwnership, projects.destroy);

  app.put('/projects/:projectId/access', auth.requiresLogin, users.checkOwnership, users.requireOwnership, users.getByUsername, projects.addAccess);
  app.del('/projects/:projectId/access', auth.requiresLogin, users.checkOwnership, users.requireOwnership, users.getByUsername, projects.removeAccess);

  //app.get('/projects/:projectId/accounts', users.checkOwnership, projects.listAccounts);

  
  //Home route
  var index = require('../app/controllers/index');
  app.get('/', index.render);

};
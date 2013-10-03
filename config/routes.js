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


  var accounts = require('../app/controllers/accounts');
  app.get('/accounts', auth.requiresLogin, accounts.all);
  app.put('/accounts', auth.requiresLogin, accounts.create);
  app.get('/accounts/:accountId', auth.account.checkOwnership, accounts.show);
  app.post('/accounts/:accountId', auth.requiresLogin, auth.account.checkOwnership, auth.account.checkAccess, auth.account.requireAdminAccess, accounts.update);
  app.del('/accounts/:accountId', auth.requiresLogin, auth.account.checkOwnership, auth.account.requireOwnership, accounts.destroy);

  app.put('/accounts/:accountId/access', auth.requiresLogin, auth.account.checkOwnership, auth.account.checkAccess, auth.account.requireAdminAccess, users.getAccessUser, accounts.addAccess);
  app.del('/accounts/:accountId/access', auth.requiresLogin, auth.account.checkOwnership, auth.account.checkAccess, auth.account.requireAdminAccess, users.getAccessUser, accounts.removeAccess);

  app.param('accountId', accounts.account);
  
  var currencies = require('../app/controllers/currencies');
  app.get('/currencies', currencies.all);
  
  /**
  * @todo - remove dummy function
  * 
  */
  app.get('/dummy/currency', currencies.dummy);

  
  var projects = require('../app/controllers/projects');
  app.param('projectId', projects.project);
  
  app.get('/projects', auth.requiresLogin, projects.all);
  app.put('/projects', auth.requiresLogin, projects.create);
  app.get('/projects/:projectId', auth.project.checkOwnership, auth.project.checkAccess, projects.show);
  app.post('/projects/:projectId', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireAdminAccess, projects.update);
  app.del('/projects/:projectId', auth.requiresLogin, auth.project.checkOwnership, auth.project.requireOwnership, projects.destroy);

  app.put('/projects/:projectId/access', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireAdminAccess, users.getAccessUser, projects.addAccess);
  app.del('/projects/:projectId/access', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireAdminAccess, users.getAccessUser, projects.removeAccess);


  var transactions = require('../app/controllers/transactions');
  app.param('transactionId', transactions.transaction);
  
  app.get('/projects/:projectId/transactions', auth.requiresLogin, 
    auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireReadAccess, 
    transactions.all
  );
  app.get('/projects/:projectId/transactions/:transactionId', auth.requiresLogin, 
    auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireReadAccess, 
    transactions.show
  );
  app.put('/projects/:projectId/transactions', 
    auth.requiresLogin, 
    auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireWriteAccess, 
    accounts.getFromParam, auth.account.checkOwnership, auth.account.checkAccess, auth.account.requireWriteAccess, 
    transactions.create
  );
  app.post('/projects/:projectId/transactions/:transactionId', auth.requiresLogin, 
    auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireWriteAccess, 
    accounts.getFromParam, auth.account.checkOwnership, auth.account.checkAccess, auth.account.requireWriteAccess, 
    auth.transaction.requireOwnershipOrAdminAccess, transactions.update
  );
  app.del('/projects/:projectId/transactions/:transactionId', auth.requiresLogin, 
    auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireWriteAccess, 
    auth.transaction.requireOwnershipOrAdminAccess, transactions.destroy
  );
  
  app.put('/projects/:projectId/accounts', 
    auth.requiresLogin, 
    auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireWriteAccess, 
    accounts.getFromParam, auth.account.checkOwnership, auth.account.checkAccess, auth.account.requireWriteAccess, 
    projects.addAccount
  );
  app.del('/projects/:projectId/accounts', auth.requiresLogin, 
    auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireAdminAccess, 
    projects.removeAccount
  );

  var categories = require('../app/controllers/categories');
  app.param('categoryId', categories.category);
  
  app.get('/projects/:projectId/categories', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireReadAccess, categories.all);
  app.put('/projects/:projectId/categories', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireAdminAccess, categories.create);
  app.patch('/projects/:projectId/categories', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireAdminAccess, categories.sort, categories.all);
  app.get('/projects/:projectId/categories/:categoryId', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireReadAccess, categories.show);
  app.post('/projects/:projectId/categories/:categoryId', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireAdminAccess, categories.update);
  app.del('/projects/:projectId/categories/:categoryId', auth.requiresLogin, auth.project.checkOwnership, auth.project.checkAccess, auth.project.requireAdminAccess, categories.destroy);
  
  //Home route
  var index = require('../app/controllers/index');
  app.get('/', index.render);

};
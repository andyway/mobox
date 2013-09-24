/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');


exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.create = function(req, res, next) {
  var user = new User(req.body);

  user.provider = 'local';
  user.save(function(err) {
    if (err) {
      return next(new Error(err));
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.jsonp(user);
    });
  });
};

exports.show = function(req, res) {
    var user = req.profile;

    res.render('users/show', {
        title: user.name,
        user: user
    });
};

exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

exports.getAccessUser = function(req, res, next) {
  User.findOne({ email: req.query.username }).exec(function(err, user) {
    if (err || !user) return res.status(404).render('error', { status: 404 });
    
    req.accessUser = user;
    next();
  });
};

exports.user = function(req, res, next, id) {
  User.findOne({ _id: id }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};


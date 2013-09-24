var mongoose = require('mongoose'),
  async = require('async'),
  Account = mongoose.model('Account'),
  _ = require('underscore');

exports.account = function(req, res, next, id) {
  Account.findById(id, function(err, account) {
    if (err) return next(err);
    if (!account) return next(new Error('Failed to load account ' + id));
    req.account = account;
    next();
  });
};

exports.create = function(req, res, next) {
  var account = new Account(req.body);
  account.user = req.user;
  account.balance = 0;

  account.save(function(err) {
    if (err) return next(err);
    res.jsonp(account);
  });
};

exports.update = function(req, res) {
  var account = req.account;

  account = _.extend(account, req.body);

  account.save(function(err) {
    res.jsonp(account);
  });
};

exports.destroy = function(req, res) {
  var account = req.account;

  account.remove(function(err) {
    if (err) return res.render('error', { status: 500 });
    res.jsonp(account);
  });
};

exports.show = function(req, res) {
  if (req.isObjectOwner) res.jsonp(req.account.toOwnerJSON());
  else {
    res.jsonp(req.account.toUserJSON(req.user));
  }
};

exports.all = function(req, res) {
  Account.find({ $or: [ { user: req.user }, { _acl: { $elemMatch: { user: req.user } } } ] }).populate('currency').exec(function(err, accounts) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(accounts);
    }
  });
};

exports.addAccess = function(req, res, next) {
  var access = req.query.access;
  if (access != 'Read' && access != 'Write' && access != 'Admin') {
    return res.status(400).render('error', { status: 400 });
  }
  req.account.setAccess(req.accessUser, [req.query.access]);
  req.account.save(function(err, account) {
    res.jsonp(account.toOwnerJSON());
  });
};

exports.removeAccess = function(req, res, next) {
  req.account.removeAccess(req.accessUser);
  req.account.save(function(err, account) {
    res.jsonp(account.toOwnerJSON());
  });
};

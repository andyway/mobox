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

exports.getFromParam = function(req, res, next) {
  if (!req.body.account) {
    return res.send(500, 'Bad Request');
  }
  
  Account.findById(req.body.account, function(err, account) {
    if (err || !account) return next(new Error('Failed to load account ' + id));
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
  if (req.isAccountOwner) res.jsonp(req.account.toOwnerJSON());
  else {
    res.jsonp(req.account.toUserJSON(req.user));
  }
};

exports.all = function(req, res) {
  Account.find({ $or: [ { user: req.user }, { _acl: { $elemMatch: { user: req.user } } } ] }).populate('currency').sort('-created').exec(function(err, accounts) {
    var i=0, len, result = [];
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      len = accounts.length;
      for (;i<len;i++) {
        var access = accounts[i].getAccess(req.user); 
        
        if (access == 'Read' || access == 'Write') {
          result.push(accounts[i].toUserJSON(req.user));
        }
        else {
          result.push(accounts[i].toOwnerJSON());
        }
        
      }
      res.jsonp(result);
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

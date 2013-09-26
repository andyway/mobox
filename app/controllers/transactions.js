var mongoose = require('mongoose'),
  async = require('async'),
  Transaction = mongoose.model('Transaction'),
  Account = mongoose.model('Account'),
  _ = require('underscore');

exports.transaction = function(req, res, next, id) {
  Transaction.findById(id, function(err, transaction) {
    if (err) return next(err);
    if (!transaction) return next(new Error('Failed to load transaction ' + id));
    
    req.transaction = transaction;

    next();
  });
};

exports.create = function(req, res, next) {
  var transaction = new Transaction(req.body);
  transaction.created_by = req.user;
  transaction.project = req.project;

  transaction.save(function(err, transaction) {
    if (err) return res.send(500, err.message);
    
    if (transaction.type == 1) {
      req.account.balance -= transaction.amount;
    }
    if (transaction.type == 2) {
      req.account.balance += transaction.amount;
    }
    req.account.save();
    
    res.jsonp(transaction);
  });
};

exports.update = function(req, res) {
  var transaction = req.transaction;

  transaction = _.extend(transaction, req.body);

  transaction.save(function(err) {
    res.jsonp(transaction);
  });
};

exports.destroy = function(req, res) {
  var transaction = req.transaction;

  transaction.remove(function(err) {
    if (err) return res.render('error', { status: 500 });
    res.jsonp(transaction);
  });
};

exports.show = function(req, res) {
  if (req.isObjectOwner) res.jsonp(req.transaction.toOwnerJSON());
  else {
    res.jsonp(req.transaction.toUserJSON(req.user));
  }
};

exports.all = function(req, res) {
  Transaction.find({ project: req.project }).sort('-created').exec(function(err, transactions) {
    if (err) {
      res.send(500, 'Database error');
    } else {
      res.jsonp(transactions);
    }
  });
};


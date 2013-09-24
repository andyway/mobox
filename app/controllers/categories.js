var mongoose = require('mongoose'),
  async = require('async'),
  Category = mongoose.model('Category'),
  User = mongoose.model('User'),
  _ = require('underscore');

exports.category = function(req, res, next, id) {
  Category.findById(id, function(err, category) {
    if (err) return next(err);
    if (!category) return next(new Error('Failed to load category ' + id));
    
    req.category = category;

    next();
  });
};

exports.create = function(req, res, next) {
  var category = new Category(req.body);
  category.project = req.project;

  category.save(function(err) {
    if (err) return next(err);
    res.jsonp(category);
  });
};

exports.update = function(req, res) {
  var category = req.category;

  category = _.extend(category, req.body);
  category.project = req.project;

  category.save(function(err) {
    res.jsonp(category);
  });
};

exports.destroy = function(req, res) {
  var category = req.category;

  category.remove(function(err) {
    if (err) return res.render('error', { status: 500 });
    res.jsonp(category);
  });
};

exports.show = function(req, res) {
  res.jsonp(req.category);
};

exports.all = function(req, res) {
  Category.find({ project: req.project }).exec(function(err, categories) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(categories);
    }
  });
};


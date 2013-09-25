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
  Category.find({ project: req.project }).sort('weight').exec(function(err, categories) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(categories);
    }
  });
};

exports.sort = function(req, res, next) {
  var weight = 0, categories = req.body.categories;
  if (!req.body.categories || !req.body.categories.length) {
    return res.send(400, 'Bad request');
  }
  
  updateNext();
  
  function updateNext() {
    var item;
    if (!categories.length) {
      return next();
    } 
    
    item = categories.shift();
    console.log(Category.findOneAndUpdate({ project: req.project, _id: item.id }, { weight: weight++, parent: item.parent }).exec(function() {
      updateNext();
    }));
  }
  
};


var mongoose = require('mongoose'),
  async = require('async'),
  Project = mongoose.model('Project'),
  User = mongoose.model('User'),
  _ = require('underscore');

exports.project = function(req, res, next, id) {
  Project.findById(id, function(err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('Failed to load project ' + id));
    
    req.project = project;

    next();
  });
};

exports.create = function(req, res, next) {
  var project = new Project(req.body);
  project.user = req.user;

  project.save(function(err) {
    if (err) return next(err);
    res.jsonp(project);
  });
};

exports.update = function(req, res) {
  var project = req.project;

  project = _.extend(project, req.body);

  project.save(function(err) {
    res.jsonp(project);
  });
};

exports.destroy = function(req, res) {
  var project = req.project;

  project.remove(function(err) {
    if (err) return res.render('error', { status: 500 });
    res.jsonp(project);
  });
};

exports.show = function(req, res) {
  if (req.isProjectOwner) res.jsonp(req.project.toOwnerJSON());
  else {
    res.jsonp(req.project.toUserJSON(req.user));
  }
};

exports.all = function(req, res) {
  Project.find({ $or: [ { user: req.user }, { _acl: { $elemMatch: { user: req.user } } } ] }).populate('currency').exec(function(err, projects) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(projects);
    }
  });
};

exports.addAccess = function(req, res, next) {
  var access = req.query.access;
  if (access != 'Read' && access != 'Write' && access != 'Admin') {
    return res.status(400).render('error', { status: 400 });
  }
  req.project.setAccess(req.accessUser, [req.query.access]);
  req.project.save(function(err, project) {
    res.jsonp(project.toOwnerJSON());
  });
};

exports.removeAccess = function(req, res, next) {
  req.project.removeAccess(req.accessUser);
  req.project.save(function(err, project) {
    res.jsonp(project.toOwnerJSON());
  });
};


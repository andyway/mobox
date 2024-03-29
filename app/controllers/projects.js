var mongoose = require('mongoose'),
  async = require('async'),
  Project = mongoose.model('Project'),
  User = mongoose.model('User'),
  _ = require('underscore');

exports.project = function(req, res, next, id) {
  Project.findById(id).populate('accounts').exec(function(err, project) {
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
  if (req.isProjectOwner || req.accessProject == 'Admin') res.jsonp(req.project.toOwnerJSON(req.accessProject));
  else {
    res.jsonp(req.project.toUserJSON(req.user));
  }
};

exports.all = function(req, res) {
  var i=0, len, result = [];
  Project.find({ $or: [ { user: req.user }, { _acl: { $elemMatch: { user: req.user } } } ] }).populate('currency').exec(function(err, projects) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      len = projects.length;
      for (;i<len;i++) {
        var access = projects[i].getAccess(req.user); 
        
        if (access == 'Read' || access == 'Write') {
          result.push(projects[i].toUserJSON(req.user));
        }
        else {
          result.push(projects[i].toOwnerJSON(access));
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
  req.project.setAccess(req.accessUser, [req.query.access]);
  req.project.save(function(err, project) {
    res.jsonp(project.toOwnerJSON(req.accessProject));
  });
};

exports.removeAccess = function(req, res, next) {
  req.project.removeAccess(req.accessUser);
  req.project.save(function(err, project) {
    res.jsonp(project.toOwnerJSON(req.accessProject));
  });
};

exports.addAccount = function(req, res, next) {
  var access = req.query.access;

  for (var i=0;i<req.project.accounts.length; i++) {
    if (req.project.accounts[i].toString() == req.account) {
      req.project.accounts.splice(i, 1);
    }
  }

  req.project.accounts.push(req.account);
  req.project.save(function(err, project) {
    res.jsonp(project.toOwnerJSON(req.accessProject));
  });
};

exports.removeAccount = function(req, res, next) {
  var account = req.query.account;
  for (var i=0;i<req.project.accounts.length; i++) {
    if (req.project.accounts[i]._id.toString() == account) {
      req.project.accounts.splice(i, 1);
    }
  }
  req.project.save(function(err, project) {
    res.jsonp(project.toOwnerJSON(req.accessProject));
  });
};

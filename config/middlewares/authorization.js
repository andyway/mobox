exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, 'User is not authorized');
  }
  next();   
};

exports.project = {
  checkOwnership: function(req, res, next) {
    if (req.project.user.toString() == req.user.id) {
      req.isProjectOwner = true;
    }
    next();
  },
  
  requireOwnership: function(req, res, next) {
    if (!req.isProjectOwner) {
      return res.send(403, 'Access denied');
    }
    next();
  },
  
  requireReadAccess: function(req, res, next) {
    if (req.isProjectOwner) return next();
    if (req.project.getAccess(req.user)) return next();
    return res.send(403, 'Access denied');
  },
  
  requireWriteAccess: function(req, res, next) {
    if (req.isProjectOwner) return next();
    if (req.project.getAccess(req.user) == 'Write') return next();
    return res.send(403, 'Access denied');
  }

};

exports.account = {
  checkOwnership: function(req, res, next) {
    if (req.account.user.toString() == req.user.id) {
      req.isAccountOwner = true;
    }
    next();
  },
  
  requireOwnership: function(req, res, next) {
    if (!req.isAccountOwner) {
      return res.send(403, 'Access denied');
    }
    next();
  },
  
  requireReadAccess: function(req, res, next) {
    if (req.isAccountOwner) return next();
    if (req.account.getAccess(req.user)) return next();
    return res.send(403, 'Access denied');
  },
  
  requireWriteAccess: function(req, res, next) {
    if (req.isAccountOwner) return next();
    if (req.account.getAccess(req.user) == 'Write') return next();
    return res.send(403, 'Access denied');
  }

};


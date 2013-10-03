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
  
  checkAccess: function(req, res, next) {
    if (req.isProjectOwner) {
      req.accessProject = 'Owner';
    }
    else {
      req.accessProject = req.project.getAccess(req.user);
    }
    next();
  },
  
  requireOwnership: function(req, res, next) {
    if (!req.isProjectOwner) {
      return res.send(403, 'Access denied - Project Ownership is required');
    }
    next();
  },
  
  requireReadAccess: function(req, res, next) {
    if (req.accessProject) return next();
    return res.send(403, 'Access denied - Project Read Access is required');
  },
  
  requireWriteAccess: function(req, res, next) {
    if (req.accessProject == 'Write' || req.accessProject == 'Admin' || req.accessProject == 'Owner') return next();
    return res.send(403, 'Access denied - Project Write Access is required');
  },

  requireAdminAccess: function(req, res, next) {
    if (req.accessProject == 'Admin' || req.accessProject == 'Owner') return next();
    return res.send(403, 'Access denied - Project Admin Access is required');
  }
  
};

exports.account = {
  checkOwnership: function(req, res, next) {
    if (req.account.user.toString() == req.user.id) {
      req.isAccountOwner = true;
    }
    next();
  },
  
  checkAccess: function(req, res, next) {
    if (req.isAccountOwner) {
      req.accessAccount = 'Owner';
    }
    else {
      req.accessAccount = req.account.getAccess(req.user);
    }
    next();
  },
  
  requireOwnership: function(req, res, next) {
    if (!req.isAccountOwner) {
      return res.send(403, 'Access denied - Account Ownership is required');
    }
    next();
  },
  
  requireReadAccess: function(req, res, next) {
    if (req.accessAccount) return next();
    return res.send(403, 'Access denied - Account Read Access is required');
  },
  
  requireWriteAccess: function(req, res, next) {
    if (req.accessAccount == 'Write' || req.accessAccount == 'Admin' || req.accessAccount == 'Owner') return next();
    return res.send(403, 'Access denied - Account Admin Access is required');
  },

  requireAdminAccess: function(req, res, next) {
    if (req.accessAccount == 'Admin' || req.accessAccount == 'Owner') return next();
    return res.send(403, 'Access denied - Account Admin Access is required');
  }
  
};

exports.transaction = {
  requireOwnershipOrAdminAccess: function(req, res, next) {
    if (req.transaction.created_by.toString() == req.user.id || req.accessProject == 'Admin' || req.accessProject == 'Owner') {
      return next();
    }
    return res.send(403, 'Access denied - You can not modify others` transactions');
  }
  
  
};


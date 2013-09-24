'use strict';

angular.module('expence.project', ['ngResource', 'ui.router', 'expence.root'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('root.index.projects', {
        url: '',
        views: {
          projects: {
            templateUrl: 'views/project/root.index.list.html',
            controller: 'root.index.project.list', 
          },
        }      
      })

      /*
      .state('root.index.projects-edit', {
        url: '/project/edit/:projectID',
        views: {
          'projects@root': {
            templateUrl: 'views/project/root.index.edit.html',
            controller: 'root.index.project.edit', 
          },
        }      
      })
      */                                                                                 

      .state('project', {
        abstract: true,
        url: '/project/:projectID',
        templateUrl: 'views/project/view.html',
        controller: 'project.view'
      })

      .state('project.view', {
        url: '',
        views: {
          categories: {
            templateUrl: 'views/category/project.list.html',
            controller: 'project.category.list' 
          },
          access: {
            templateUrl: 'views/project/project.access.list.html',
            controller: 'project.access.list' 
          },
          accounts: {
            templateUrl: 'views/account/project.list.html',
            controller: 'project.account.list' 
          },
        }      
      })

      ;                                                                               
  }])

  .controller('project.view', ['$scope', '$state', '$stateParams', 'Project', function($scope, $state, $stateParams, Project) {
    console.log('view');
    $scope.showACL = false;
    
    $scope.project = Project.get({ id: $stateParams.projectID }, function() {
      if ($scope.project._acl && typeof($scope.project._acl) == 'string') {
        $scope.project.access = $scope.project._acl;
        delete ($scope.project._acl);
      }
      
      if ($scope.project._acl) {
        $scope.showACL = true;
      }
    });
    
    $state.go('project.view');
  }])
  
  .controller('root.index.project', ['$scope', 'userProjects', function($scope, userProjects) {
    $scope.userProjects = userProjects;
  }])
  
  .controller('project.access.list', ['$scope', '$state', 'Project', function($scope, $state, Project) {
    $scope.access = 'Read';

    $scope.submit = function(username, access) {
      $scope.error = false;
      username = username || $scope.username;
      access = access || $scope.access;
      
      $scope.project.$addAccess({ access: access, username: username }, null, function(data) {
        if (data.status == '404') {
          $scope.error = true;
        }
      });  
    }
    
    $scope.remove = function(username) {
      $scope.project.$removeAccess({ id: $scope.project._id, username: username }, null, function(data) {
        if (data.status == '404') {
          $scope.error = true;
        }
      });  
    }
  }])
  
  /*
  .controller('root.index.project.edit', ['$scope', '$state', '$stateParams', 'Project', function($scope, $state, $stateParams, Project) {
    console.log('edit', $stateParams);
    $scope.project = { };
    
    if ($stateParams.projectID) {
      $scope.project = Project.get({id: $stateParams.projectID});
    }

    $scope.submit = function() {
      if ($scope.project._id) {
        Project.update($scope.project, success);
      }
      else {
        Project.create($scope.project, success);
      }
      
    }
    
    $scope.remove = function() {
      if ($scope.project._id) {
        Project.remove({ id: $scope.project._id }, success);
      }
    }
    
    var success = function(data) {
      $state.go('^');
    }
    
  }])
  */
  
  .controller('root.index.project.list', ['$rootScope', '$scope', '$state', 'Project', 'userProjects', function($rootScope, $scope, $state, Project, userProjects) {
    console.log('list');
    userProjects.data = Project.list();
    $scope.projects = userProjects.data;
    
    $scope.isBeingEdited = function(project) {
      if (!project && $scope.editableProject && !$scope.editableProject._id) return true;
      
      return ($scope.editableProject && project && $scope.editableProject._id == project._id);
    }
    
    $scope.edit = function(project) {
      if (project) {
        $scope.editableProject = project;
      }
      else {
        $scope.editableProject = new Project();
      }
    }
    
    $scope.view = function(project) {
      $scope.editableProject = null;
    }

    $scope.submit = function() {
      if ($scope.editableProject._id) {
        Project.update($scope.editableProject, function() {
          $scope.view();
        });
      }
      else {
        Project.create($scope.editableProject, success);
      }
      
    }
    
    $scope.remove = function() {
      if ($scope.editableProject._id) {
        Project.remove({ id: $scope.editableProject._id }, success);
      }
    }
    
    var success = function(data) {
      userProjects.data = Project.list();
      $scope.projects = userProjects.data;
      $scope.view();
    }
    
  }])

  .controller('project.sidebar', ['$scope', 'currentUser', 'userProjects', function($scope, currentUser, userProjects) {
    $scope.userProjects = userProjects;
  }])

  .factory('Project', function($resource){
    return $resource('/projects/:id/:method', {}, {
      list: { method:'GET', params: { id: '@_id' }, isArray: true },
      update: { method:'POST', params: { id: '@_id' } },
      create: { method:'PUT', params: { id: '@_id' } },
      remove: { method:'DELETE', params: { id: '@_id' } },
      addAccess: { method:'PUT', params: { id: '@_id', method: 'access' } },
      removeAccess: { method:'DELETE', params: { id: '@_id', method: 'access', value: '@username' } }
    });
  })
  
  .factory('userProjects', function(){
    return { data: null };
  })

;
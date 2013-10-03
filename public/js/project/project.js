'use strict';

angular.module('expence.project', ['ngResource', 'ui.router', 'expence.root'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('root.index.projects', {
        url: '/:action',
        views: {
          projects: {
            templateUrl: 'views/project/root.index.list.html',
            controller: 'root.index.project.list', 
          },
        }      
      })

      .state('root.index.projects-edit', {
        url: '/project-edit',
        views: {
          'projects@root': {
            template: ' ',
            controller: 'root.index.project.reload', 
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

      .state('root.project', {
        abstract: true,
        url: '/project/:projectID',
        views: {
          '@': {
            templateUrl: 'views/project/view.html',
            controller: 'root.project.view',
          },
        },      
        resolve:{
          theProject:  function($stateParams, Project) {
            return Project.get({ id: $stateParams.projectID });
          }
        }
      })

      .state('root.project.view', {
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
          transactions: {
            templateUrl: 'views/transaction/project.list.html',
            controller: 'project.transaction.list' 
          },
        }      
      })

      ;                                                                               
  }])

  .controller('root.project.view', ['$scope', '$state', '$stateParams', 'Project', 'theProject', 'currentUser', function($scope, $state, $stateParams, Project, theProject, currentUser) {
    $scope.project = theProject;
    
    theProject.$then(function() {
      theProject.sortedUsers = {};
      theProject.sortedUsers[currentUser._id] = 'You';
      theProject.transactionWatch = 0;
      
      theProject.filters = { 
        categories: [],
        accounts: [],
        users: []
      };
      
      if (typeof(theProject._acl) == 'object') {
        for (var i=0;i<theProject._acl.length;i++) {
          theProject.sortedUsers[theProject._acl[i]._id] = theProject._acl[i].username;
        }
      }
      $state.go('root.project.view');
    });
    
  }])
  
  .controller('root.index.project', ['$scope', 'ProjectFactory', function($scope, ProjectFactory) {
  }])
  
  .controller('root.index.project.reload', ['$scope', '$state', function($scope, $state) {
    $state.go('root.index.projects', { action: 'add' });
  }])
  
  .controller('project.access.list', ['$scope', '$state', 'theProject', function($scope, $state, theProject) {
    $scope.access = 'Read';

    $scope.submit = function(username, access) {
      $scope.error = false;
      username = username || $scope.username;
      access = access || $scope.access;
      
      theProject.$addAccess({ access: access, username: username }, null, function(data) {
        if (data.status == '404') {
          $scope.error = true;
        }
      });  
    }
    
    $scope.remove = function(username) {
      theProject.$removeAccess({ id: theProject._id, username: username }, null, function(data) {
        if (data.status == '404') {
          $scope.error = true;
        }
      });  
    }
  }])
  
  .controller('root.index.project.list', ['$scope', '$state', 'Project', 'ProjectFactory', function($scope, $state, Project, ProjectFactory) {
    $scope.ProjectFactory = ProjectFactory;
    
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
      ProjectFactory.userProjects = Project.list();
      $scope.view();
    }
    
    if ($state.params.action && $state.params.action != '') {
      $scope.edit();
    }
    
  }])

  .controller('project.sidebar', ['$scope', 'currentUser', 'ProjectFactory', function($scope, currentUser, ProjectFactory) {
    $scope.ProjectFactory = ProjectFactory;
  }])

  .factory('Project', function($resource){
    return $resource('/projects/:id/:method', {}, {
      list: { method:'GET', params: { id: '@_id' }, isArray: true },
      get: { method:'GET', params: { id: '@_id' }, isArray: false },
      update: { method:'POST', params: { id: '@_id' } },
      create: { method:'PUT', params: { id: '@_id' } },
      remove: { method:'DELETE', params: { id: '@_id' } },
      addAccess: { method:'PUT', params: { id: '@_id', method: 'access' } },
      removeAccess: { method:'DELETE', params: { id: '@_id', method: 'access', value: '@username' } },
      addAccount: { method:'PUT', params: { id: '@_id', method: 'accounts', account: '@account' } },
      removeAccount: { method:'DELETE', params: { id: '@_id', method: 'accounts', account: '@account' } }
    });
  })
  
  .factory('ProjectFactory', function(){
    return { 
      userProjects: []
    };
  })

;
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
        url: '/project/:projectID',
        templateUrl: 'views/project/view.html',
        controller: 'project.view', 
      })

      ;                                                                               
  }])

  .controller('project.view', ['$scope', '$stateParams', 'Project', function($scope, $stateParams, Project) {
    console.log('view');
    $scope.project = Project.get({ id: $stateParams.projectID });
  }])
  
  .controller('root.index.project', ['$scope', 'userProjects', function($scope, userProjects) {
    $scope.userProjects = userProjects;
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
    return $resource('/projects/:id', {}, {
      list: { method:'GET', params: { id: '@_id' }, isArray: true },
      update: { method:'POST', params: { id: '@_id' } },
      create: { method:'PUT', params: { id: '@_id' } },
      remove: { method:'DELETE', params: { id: '@_id' } }
    });
  })
  
  .factory('userProjects', function(){
    return { data: null };
  })

;
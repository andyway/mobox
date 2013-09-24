'use strict';

angular.module('expence.category', ['ngResource', 'ui.router', 'expence.project'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    
  }])

  .controller('project.category.list', ['$scope', '$state', 'theProject', 'Category', function($scope, $state, theProject, Category) {
    $scope.categories = Category.list({ projectID: theProject._id });

    $scope.submit = function(category) {
      if (!category) {
        category = new Category();
      }
      
      category = $.extend(category, $scope.category);
      
      if (category._id) {
        category.$update({ projectID: theProject._id });  
      }
      else {
        category.$create({ projectID: theProject._id });
        $scope.categories = Category.list({ projectID: theProject._id });
      }
      
      $scope.category = null;
    }
    
    $scope.edit = function(cat) {
      $scope.category = cat;  
    }
    
    $scope.remove = function(category) {
      category.$remove({ projectID: theProject._id, id: category._id });
      $scope.categories = Category.list({ projectID: theProject._id });  
    }
  }])

  .factory('Category', function($resource){
    return $resource('/projects/:projectID/categories/:id', {}, {
      list: { method:'GET', params: { projectID: '@projectID', id: '@_id' }, isArray: true },
      update: { method:'POST', params: { id: '@_id' } },
      create: { method:'PUT', params: { id: '@_id' } },
      remove: { method:'DELETE', params: { projectID: '@projectID', id: '@_id' } },
    });
  })
  

;
'use strict';

angular.module('expence.category', ['ngResource', 'ui.router', 'expence.project'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    
  }])

  .controller('project.category.list', ['$scope', '$state', 'theProject', 'Category', 'projectCategories', function($scope, $state, theProject, Category, projectCategories) {
    $scope.isBeingSorted = false;
    updateCategoryTree();
    
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
        updateCategoryTree();
      }
      
      $scope.category = null;
    }
    
    $scope.edit = function(cat) {
      $scope.category = cat;  
    }
    
    $scope.remove = function(category) {
      category.$remove({ projectID: theProject._id, id: category._id });
      updateCategoryTree();  
    }
    
    $scope.finishSorting = function() {
      $scope.isBeingSorted = false;
      console.log($scope.nestable);
      Category.sort({ projectID: theProject._id, categories: $scope.nestable });
    }
    
    function updateCategoryTree() {
      Category.list({ projectID: theProject._id }, null, function(categories) {
        var cats = {};
        
        for (var i=0;i<categories.length;i++) {
          var parent = categories[i].parent || 'root';
          
          if (!cats[parent]) {
            cats[parent] = [];
          }
          cats[parent].push(categories[i]);
        }

        projectCategories.data = categories;
        $scope.categories = cats;
      });
    }
  }])

  .factory('Category', function($resource){
    return $resource('/projects/:projectID/categories/:id', {}, {
      list: { method:'GET', params: { projectID: '@projectID', id: '@_id' }, isArray: true },
      update: { method:'POST', params: { id: '@_id' } },
      create: { method:'PUT', params: { id: '@_id' } },
      remove: { method:'DELETE', params: { projectID: '@projectID', id: '@_id' } },
      sort: { method:'PATCH', params: { projectID: '@projectID', id: '@_id' }, isArray: true },
    });
  })
  
  .factory('projectCategories', function(){
    return { data: null };
  })

;
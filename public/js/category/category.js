'use strict';

angular.module('expence.category', ['ngResource', 'ui.router', 'expence.project'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    
  }])

  .controller('project.category.list', ['$scope', '$state', 'theProject', 'Category', function($scope, $state, theProject, Category) {
    $scope.isBeingSorted = false;
    $scope.category = { color: get_random_color() };
    $scope.color_changed = 0;
    
    theProject.$then(function() {
      updateCategoryTree();

      $scope.$watch('project.transactionWatch', function() {
        updateCategoryTree();
      });
    
    });
    
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
      
      $scope.color_changed++;
      $scope.category = { color: get_random_color() };
      
    }
    
    $scope.edit = function(cat) {
      $scope.category = cat;
      $scope.color_changed++;  
    }
    
    $scope.remove = function(category) {
      category.$remove({ projectID: theProject._id, id: category._id });
      updateCategoryTree();  
    }
    
    $scope.toggleFilter = function(category) {
      var index = _.indexOf(theProject.filters.categories, category._id);
      if (index > -1) {
        theProject.filters.categories.splice(index, 1);
      }
      else {
        theProject.filters.categories.push(category._id);
      }
      
    }
    
    $scope.finishSorting = function() {
      $scope.isBeingSorted = false;
      Category.sort({ projectID: theProject._id, categories: $scope.nestable }, function(categories) {
        updateSortedCategories(categories)
      });
    }
    
    $scope.startSorting = function() {
      $scope.isBeingSorted = true;
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

        theProject.categories = categories;
        updateSortedCategories(categories);
        
        $scope.categories = cats;
      });
    }
    
    function updateSortedCategories(categories) {
      theProject.sortedCategories = {};
      for (var i=0;i<categories.length;i++) {
        theProject.sortedCategories[categories[i]._id] = categories[i];
      }
      
    }
  
    function get_random_color() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
      }
      return color;
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
  
;
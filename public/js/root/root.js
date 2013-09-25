'use strict';

angular.module('expence.root', ['ngResource', 'ui.router', 'ui.bootstrap'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('root', {
        url: '',
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/index.html',
            controller: 'root', 
          },
        }      
      })

      .state('root.index', {
        url: '/dashboard',
        views: {
          'projects': {
            templateUrl: 'views/project/root.index.list.html',
            controller: 'root.index.project.list', 
          },
          'accounts': {
            templateUrl: 'views/account/root.index.list.html',
            controller: 'root.index.account.list', 
          },
        }     
      })

      ;
      
      $urlRouterProvider.when('', '/dashboard');             
  }])
  
  .controller('root', ['$scope', '$state', '$stateParams', 'currentUser', function($scope, $state, $stateParams, currentUser) {
    $scope.currentUser = currentUser;
    $scope.$state = $state;
    $state.go('root.index');
  }])

  .directive('nestable', function() {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        var options = scope.$eval(attrs.nestable), model = options.model || 'nestable';
        
        elm.nestable(options).on('change', function() {
          scope[model] = [];
          elm.find('[data-id]').each(function() {
            var el = $(this), parent = $(this).parents('[data-id]').first();
            if (!parent.length) parent = null;
            else parent = parent.attr('data-id');
            
            scope[model].push({ id: el.attr('data-id'), parent: parent});
          });
          scope.$apply();
        });
      }
    };
  })
;
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
  
  .run(['$location', 'AccountFactory', 'ProjectFactory', 'Account', 'Project', function($location, AccountFactory, ProjectFactory, Account, Project) {
    if ($location.$$url.indexOf('/project/') == 0) {
      AccountFactory.userAccounts = Account.list();
      ProjectFactory.userProjects = Project.list();
    }
  }])
  
  .controller('root', ['$scope', '$state', '$stateParams', 'currentUser', 'AccountFactory', 'ProjectFactory', 'Account', 'Project', function($scope, $state, $stateParams, currentUser, AccountFactory, ProjectFactory, Account, Project) {
    $scope.currentUser = currentUser;
    
    $scope.AccountFactory = AccountFactory.userAccounts;
    $scope.ProjectFactory = ProjectFactory.userProjects;
                                             
    AccountFactory.userAccounts = Account.list();
    ProjectFactory.userProjects = Project.list();

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

  .directive('ngAccessTriangle', function() {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        var options = scope.$eval(attrs.ngAccessTriangle);
        
        elm.addClass('ng-access-triangle access-'+options.access);
        
        if (options.access == 'Owner') {
          elm.append('<label title="Owner access"><i class="icon-check"></i></label>');
        }
        if (options.access == 'Read') {
          elm.append('<label title="Read access"><i class="icon-eye-open"></i></label>');
        }
        if (options.access == 'Write') {
          elm.append('<label title="Write access"><i class="icon-pencil"></i></label>');
        }
      }
    };
  })

  .directive('colorpicker', function() {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        var options = scope.$eval(attrs.colorpicker);
        
        elm.minicolors(options);
        
      }
    };
  })

  ;
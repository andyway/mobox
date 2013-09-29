'use strict';

angular.module('expence.user', ['ngResource', 'ngCookies', 'ui.router', 'expence.project'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('user_login', {
        url: '/login',
        templateUrl: 'views/login.html', 
        controller: 'user.login'
      })             
      .state('user_register', {
        url: '/register',
        templateUrl: 'views/register.html', 
        controller: 'user.register'
      })             

    ;
    
  }])

  .run(['$location', 'currentUser', function($location, currentUser) {
    angular.extend(currentUser, window.user);
    
    if (!currentUser._id) {
      $location.path('/login');
    }
  }])
  
  .factory('User', function($resource){
    return $resource('/users/:id', {}, {
      login: { method:'POST', params: { id: '@id' } },
      create: { method:'PUT' },
    });
  })
  
  .controller('user.login', ['$scope', '$state', 'User', 'currentUser', function($scope, $state, User, currentUser) {
    $scope.currentUser = currentUser;
    
    $scope.login = function() {
      var user = new User();
      user.email = $scope.email;
      user.password = $scope.password;
      
      user.$login({ id: 'me' }, 
        function(data) {
          $scope.error = false;
          
          angular.extend(currentUser, data);
          location.href = '/';
          //$state.go('root.index');
        }, 
        function(data) {
          $scope.error = true;
        }
      );
      
    }
    
  }])

  .controller('user.register', ['$scope', '$state', 'User', 'currentUser', function($scope, $state, User, currentUser) {
    var user;
    $scope.success = false;
    $scope.error = false;
    
    $scope.register = function() {
      var interval;
      
      user = new User();
      
      angular.extend(user, $scope.user);

      user.$create(function(data) {
        $scope.error = false;
        $scope.success = true;
        
        angular.extend(currentUser, data);
        
        $scope.timeToRedirect = 3;
        interval = setInterval(function() {
          $scope.timeToRedirect -= 1;

          if ($scope.timeToRedirect < 1) {
            clearInterval(interval);
            location.href = '/';
            //$state.go('root.index');
          }
          $scope.$apply();
        }, 1000);
        
          
      }, function() {
        $scope.error = true;
        
      });
      
      return false;
    }
    
  }])
  
  .factory('currentUser', function(){
    return { };
  })

;
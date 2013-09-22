'use strict';

angular.module('expence.account', ['ngResource', 'ui.router', 'expence.root'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('root.index.accounts', {
        url: '',
        views: {
          accounts: {
            templateUrl: 'views/account/root.index.list.html',
            controller: 'root.index.account.list', 
          },
        }      
      })

      .state('root.index.accounts-edit', {
        url: '/account/edit/:accountID',
        views: {
          'accounts@root': {
            templateUrl: 'views/account/root.index.edit.html',
            controller: 'root.index.account.edit', 
          },
        }      
      })

      ;             
  }])

  .controller('root.index.account', ['$scope', 'userAccounts', function($scope, userAccounts) {
    $scope.userAccounts = userAccounts;
    console.log('root');
  }])
  
  .controller('root.index.account.edit', ['$scope', '$state', '$stateParams', 'Account', 'Currency', function($scope, $state, $stateParams, Account, Currency) {
    console.log('edit', $stateParams);
    $scope.account = { };
    $scope.currencies = Currency.list();
    
    if ($stateParams.accountID) {
      $scope.account = Account.get({id: $stateParams.accountID});
    }

    $scope.submit = function() {
      if ($scope.account._id) {
        Account.update($scope.account, success);
      }
      else {
        Account.create($scope.account, success);
      }
      
    }
    
    $scope.remove = function() {
      if ($scope.account._id) {
        Account.remove({ id: $scope.account._id }, success);
      }
    }
    
    var success = function(data) {
      $state.go('^');
    }
    
  }])
  
  .controller('root.index.account.list', ['$rootScope', '$scope', '$state', 'Account', 'userAccounts', function($rootScope, $scope, $state, Account, userAccounts) {
    console.log('list');
    userAccounts.data = Account.list();
    $scope.accounts = userAccounts.data;
 }])

  .controller('account.sidebar', ['$scope', 'userAccounts', function($scope, userAccounts) {
    console.log('sidebar');
    $scope.userAccounts = userAccounts;
  }])

  .factory('Account', function($resource){
    return $resource('/accounts/:id', {}, {
      list: { method:'GET', params: { id: '@_id' }, isArray: true },
      update: { method:'POST', params: { id: '@_id' } },
      create: { method:'PUT', params: { id: '@_id' } },
      remove: { method:'DELETE', params: { id: '@_id' } }
    });
  })
  
  .factory('Currency', function($resource){
    return $resource('/currencies/:id', {}, {
      list: { method:'GET', params: { id: '@id' }, isArray: true },
    });
  })
  
  .factory('userAccounts', function(){
    return { data: null };
  })

;
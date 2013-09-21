'use strict';

angular.module('expence.account', ['ngResource', 'ui.router', 'expence.root'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
  }])

  .controller('account.root.list', ['$scope', '$state', 'User', 'currentUser', 'Account', 'Currency', 'userAccounts', function($scope, $state, User, currentUser, Account, Currency, userAccounts) {
    userAccounts = Account.list();
    $scope.accounts = userAccounts;
    $scope.currencies = Currency.list();
    $scope.account = { };
    
    $scope.create = function(acc) {
      $scope.edit = true;

      if (acc) {
        $scope.account = acc;
        $scope.account.currency = $scope.account.currency._id;
      }
      else {
        $scope.account = { };
      }
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
      $scope.edit = false;
      userAccounts = Account.list();
      $scope.accounts = userAccounts;
    }
    
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
    return { };
  })

;
'use strict';

angular.module('expence.transaction', ['ngResource', 'ui.router', 'expence.project'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    
  }])

  .controller('project.transaction.list', ['$scope', '$state', 'theProject', 'AccountFactory', 'Transaction', function($scope, $state, theProject, AccountFactory, Transaction) {
    $scope.AccountFactory = AccountFactory;
    $scope.theProject = theProject;
    
    $scope.transaction = { type: 1 };
    
    theProject.$then(function() {
      $scope.transactions = Transaction.list({ projectID: theProject._id });
    });
    
        
    $scope.submit = function(transaction) {
      $scope.error = false;
      if (!transaction) {
        transaction = new Transaction();
      }
      
      transaction = $.extend(transaction, $scope.transaction);
      if (transaction._id) {
        transaction.$update({ projectID: theProject._id });  
      }
      else {
        transaction.$create({ projectID: theProject._id }, function() {
          $scope.transactions.unshift(transaction);
          $scope.transaction = null;
        }, function(data) {
          $scope.error = data.data;
        });
        
      }
      
    }
    
  }])

  .factory('Transaction', function($resource){
    return $resource('/projects/:projectID/transactions/:id', {}, {
      list: { method:'GET', params: { projectID: '@projectID', id: '@_id' }, isArray: true },
      update: { method:'POST', params: { id: '@_id' } },
      create: { method:'PUT', params: { id: '@_id' } },
      remove: { method:'DELETE', params: { projectID: '@projectID', id: '@_id' } }
    });
  })
  
  .filter('transactionType', function() {
    return function(type) {
      if (type == 1) return 'Cost';
      return 'Inflow';
    }
  });
  

;
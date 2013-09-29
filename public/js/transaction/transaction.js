'use strict';

angular.module('expence.transaction', ['ngResource', 'ui.router', 'expence.project'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    
  }])

  .controller('project.transaction.list', ['$scope', '$state', 'theProject', 'AccountFactory', 'Transaction', function($scope, $state, theProject, AccountFactory, Transaction) {
    $scope.AccountFactory = AccountFactory;
    $scope.theProject = theProject;
    $scope.filteredData = [];
    
    theProject.$then(function() {
      $scope.transactions = Transaction.list({ projectID: theProject._id });
      $scope.transactions.$then($scope.paginate);
    });
    
        
    $scope.submit = function(transaction) {
      $scope.error = false;
      if (!transaction) {
        transaction = new Transaction();
      }
      
      transaction = $.extend(transaction, $scope.transaction);
      if (transaction._id) {
        transaction.$update({ projectID: theProject._id });  
        $scope.reset();
      }
      else {
        transaction.$create({ projectID: theProject._id }, function() {
          $scope.transactions.unshift(transaction);
          $scope.paginate();
          $scope.reset();
        }, function(data) {
          $scope.error = data.data;
        });
        
      }
      
    }
    
    $scope.edit = function(transaction) {
      $scope.transaction = transaction;
    }
    
    $scope.reset = function() {
      $scope.transaction = { type: 1 };
    }
    
    $scope.reset();
    
    $scope.filter = function(transaction) {
      if (theProject.filters.categories.length && !_.intersection(theProject.filters.categories, transaction.categories).length) {
        return false;
      }
      
      if (theProject.filters.accounts.length && theProject.filters.accounts.indexOf(transaction.account) < 0) {
        return false;
      }
      
      return true;
    }
    
    /**
    * Paging
    * 
    */
    $scope.pager = {
      currentPage: 1,
      itemsPerPage: 10,
      maxSize: 5,
      data: [],
      totalItems: 0
    }
    
    $scope.paginate = function() {
      var i=0, len = $scope.transactions.length;
      
      $scope.filteredData = [];
      
      for(;i<len;i++) {
        if ($scope.filter($scope.transactions[i])) {
          $scope.filteredData.push($scope.transactions[i]);
        }
      }
      
      $scope.pager.totalItems = $scope.filteredData.length;
      $scope.updatePager();
      
      /**
      * @todo - fix hack angular.ui -> boostrap3
      */
      $('[data-pagination] > ul').addClass('pagination');
    }
    
    $scope.onSelectPage = function(page) {
      $scope.pager.currentPage = page;
    }
    
    $scope.updatePager = function() {
      var begin = (($scope.pager.currentPage - 1) * $scope.pager.itemsPerPage), end = begin + $scope.pager.itemsPerPage;
      $scope.pager.data = $scope.filteredData.slice(begin, end);
    }
    
    $scope.$watch('pager.currentPage', function(newPage){
      $scope.updatePager();
    });
    
    $scope.$watch('theProject.filters', function(){
      $scope.paginate();
    }, true);
    
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
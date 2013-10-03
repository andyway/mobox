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

      .state('root.index.accounts-access', {
        url: '/account/access/:accountID',
        views: {
          'accounts@root': {
            templateUrl: 'views/account/root.index.access.html',
            controller: 'root.index.account.access', 
          },
        }      
      })

      ;             
  }])

  .controller('root.index.account', ['$scope', 'AccountFactory', function($scope, AccountFactory) {
    $scope.AccountFactory = AccountFactory;
  }])
  
  .controller('root.index.account.edit', ['$scope', '$state', '$stateParams', 'Account', 'Currency', 'AccountFactory', function($scope, $state, $stateParams, Account, Currency, AccountFactory) {
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
      AccountFactory.userAccounts = Account.list();
      $state.go('^');
    }
    
  }])
  
  .controller('root.index.account.access', ['$scope', '$state', '$stateParams', 'Account', function($scope, $state, $stateParams, Account) {
    $scope.access = 'Read';
    $scope.account = Account.get({id: $stateParams.accountID }, function() {
      if ($scope.account._acl && typeof($scope.account._acl) == 'string') {
        $scope.account.access = $scope.account._acl;
        delete ($scope.account._acl);
      }
    });
    
    $scope.submit = function(username, access) {
      $scope.error = false;
      username = username || $scope.username;
      access = access || $scope.access;
      
      $scope.account.$addAccess({ access: access, username: username }, null, function(data) {
        $scope.error = true;
      });  
    }
    
    $scope.remove = function(username) {
      $scope.account.$removeAccess({ id: $scope.account._id, username: username }, null, function(data) {
        $scope.error = true;
      });  
    }
  }])
  
  .controller('root.index.account.list', ['$rootScope', '$scope', '$state', 'Account', 'AccountFactory', function($rootScope, $scope, $state, Account, AccountFactory) {
    $scope.AccountFactory = AccountFactory;
 }])

  .controller('account.sidebar', ['$scope', 'AccountFactory', function($scope, AccountFactory) {
    $scope.AccountFactory = AccountFactory;
  }])

  .controller('project.account.list', ['$scope', '$state', 'theProject', 'AccountFactory', 'Account', 'Project', function($scope, $state, theProject, AccountFactory, Account, Project) {
    theProject.$then(function() {
      sortAccounts();
      
      $scope.$watch('project.transactionWatch', function(val) {
        if (theProject.transactionWatch && theProject.transactionWatch > 0) {
          updateAccounts();
        }
      });
    });
    
    
    $scope.AccountFactory = AccountFactory;
    
    $scope.toggleFilter = function(account) {
      var index = _.indexOf(theProject.filters.accounts, account._id);
      if (index > -1) {
        theProject.filters.accounts.splice(index, 1);
      }
      else {
        theProject.filters.accounts.push(account._id);
      }
    }
    
    $scope.submit = function() {
      $scope.error = false;
      
      new Project({account: $scope.account}).$addAccount({ id: theProject._id }, function(data) {
        theProject.accounts = data.accounts;
        sortAccounts();
      }, function(data) {
        $scope.error = data.data;
      });  
    }
    
    $scope.remove = function(account) {
      Project.removeAccount({ id: theProject._id, account: account._id }, function(data) {
        theProject.accounts = data.accounts;
        sortAccounts();
      }, function(data) {
        $scope.error = data.data;
      });  
    }
    
    function updateAccounts() {
      Project.get({ id: theProject._id }, function(data) {
        theProject.accounts = data.accounts;
        sortAccounts();
      });
    }
    
    function sortAccounts() {
      theProject.sortedAccounts = {};
      
      for (var i=0;i<theProject.accounts.length;i++) {
        
        if (theProject.accounts[i].statistics) {
          for (var j=0;j<theProject.accounts[i].statistics.length;j++) {
            if (theProject.accounts[i].statistics[j].project == theProject._id.toString()) {
              theProject.accounts[i].statistics = theProject.accounts[i].statistics[j];
              break;
            }  
          }
        }
        
        theProject.sortedAccounts[theProject.accounts[i]._id] = theProject.accounts[i];
      }
    }

  }])
  
  .factory('Account', function($resource){
    return $resource('/accounts/:id/:method', {}, {
      list: { method:'GET', params: { id: '@_id' }, isArray: true },
      update: { method:'POST', params: { id: '@_id' } },
      create: { method:'PUT', params: { id: '@_id' } },
      remove: { method:'DELETE', params: { id: '@_id' } },
      addAccess: { method:'PUT', params: { id: '@_id', method: 'access' } },
      removeAccess: { method:'DELETE', params: { id: '@_id', method: 'access', value: '@username' } }
    });
  })
  
  .factory('Currency', function($resource){
    return $resource('/currencies/:id', {}, {
      list: { method:'GET', params: { id: '@id' }, isArray: true },
    });
  })
  
  .factory('AccountFactory', function(){
    return { 
      userAccounts: {} , 
      projectAccounts: {}
    };
  })
  
;
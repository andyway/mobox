'use strict';

angular.module('expence.sidebar', ['ui.bootstrap'])
  
  .controller('root.sidebar', ['$scope', 'currentUser', function($scope, currentUser) {
    $scope.currentUser = currentUser;  
    
    
  }])

;
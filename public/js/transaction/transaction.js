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
        transaction.$update({ projectID: theProject._id }, null, function(data) {
          $scope.error = data.data;
        });  
        $scope.reset();
        theProject.transactionWatch++;
      }
      else {
        transaction.$create({ projectID: theProject._id }, function() {
          $scope.transactions.unshift(transaction);
          $scope.paginate();
          $scope.reset();
          theProject.transactionWatch++;
        }, function(data) {
          $scope.error = data.data;
        });
        
      }
      
    }
    
    $scope.batch = function() {
      var k=0, min = 10, max = 1000, i=0,
      count = parseInt($scope.transaction.description);
      create();
      
      function create() {
        var transaction = new Transaction($scope.transaction);
        
        transaction.description = loremIpsum(); 
        transaction.amount = (Math.random() * (max - min + 1)) + min; 
        transaction.type = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        transaction.account = theProject.accounts[Math.floor(Math.random()*theProject.accounts.length)]._id; 
        transaction.category = theProject.categories[Math.floor(Math.random()*theProject.categories.length)]._id; 
        
        transaction.$create({ projectID: theProject._id }, function() {
          $scope.transactions.unshift(transaction);
          $scope.paginate();
          theProject.transactionWatch++;
          
          k++;
          console.log(k, count);
          if (k >= count) {
            
          }
          else {
            create();
          }
        });
      }

      function loremIpsum() {
        var loremIpsumWordBank = new Array("lorem","ipsum","dolor","sit","amet,","consectetur","adipisicing","elit,","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua.","enim","ad","minim","veniam,","quis","nostrud","exercitation","ullamco","laboris","nisi","ut","aliquip","ex","ea","commodo","consequat.","duis","aute","irure","dolor","in","reprehenderit","in","voluptate","velit","esse","cillum","dolore","eu","fugiat","nulla","pariatur.","excepteur","sint","occaecat","cupidatat","non","proident,","sunt","in","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum.","sed","ut","perspiciatis,","unde","omnis","iste","natus","error","sit","voluptatem","accusantium","doloremque","laudantium,","totam","rem","aperiam","eaque","ipsa,","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt,","explicabo.","nemo","enim","ipsam","voluptatem,","quia","voluptas","sit,","aspernatur","aut","odit","aut","fugit,","sed","quia","consequuntur","magni","dolores","eos,","qui","ratione","voluptatem","sequi","nesciunt,","neque","porro","quisquam","est,","qui","dolorem","ipsum,","quia","dolor","sit,","amet,","consectetur,","adipisci","velit,","sed","quia","non","numquam","eius","modi","tempora","incidunt,","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem.","ut","enim","ad","minima","veniam,","quis","nostrum","exercitationem","ullam","corporis","suscipit","laboriosam,","nisi","ut","aliquid","ex","ea","commodi","consequatur?","quis","autem","vel","eum","iure","reprehenderit,","qui","in","ea","voluptate","velit","esse,","quam","nihil","molestiae","consequatur,","vel","illum,","qui","dolorem","eum","fugiat,","quo","voluptas","nulla","pariatur?","at","vero","eos","et","accusamus","et","iusto","odio","dignissimos","ducimus,","qui","blanditiis","praesentium","voluptatum","deleniti","atque","corrupti,","quos","dolores","et","quas","molestias","excepturi","sint,","obcaecati","cupiditate","non","provident,","similique","sunt","in","culpa,","qui","officia","deserunt","mollitia","animi,","id","est","laborum","et","dolorum","fuga.","harum","quidem","rerum","facilis","est","et","expedita","distinctio.","Nam","libero","tempore,","cum","soluta","nobis","est","eligendi","optio,","cumque","nihil","impedit,","quo","minus","id,","quod","maxime","placeat,","facere","possimus,","omnis","voluptas","assumenda","est,","omnis","dolor","repellendus.","temporibus","autem","quibusdam","aut","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet,","ut","et","voluptates","repudiandae","sint","molestiae","non","recusandae.","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus,","aut","reiciendis","voluptatibus","maiores","alias","consequatur","aut","perferendis","doloribus","asperiores","repellat");
        var minWordCount = 2;
        var maxWordCount = 7;

        var randy = Math.floor(Math.random()*(maxWordCount - minWordCount)) + minWordCount;
        var ret = "";
        for(i = 0; i < randy; i++) {
          var newTxt = loremIpsumWordBank[Math.floor(Math.random() * (loremIpsumWordBank.length - 1))];
          if (ret.substring(ret.length-1,ret.length) == "." || ret.substring(ret.length-1,ret.length) == "?") {
            newTxt = newTxt.substring(0,1).toUpperCase() + newTxt.substring(1, newTxt.length);
          }
          ret += " " + newTxt;
        }
        return ret;
      }
    }
    
    $scope.remove = function(transaction) {
      transaction.$remove({ projectID: theProject._id, id: transaction._id }, function() {
        var i=0, len = $scope.transactions.length;
        for (;i<len;i++) {
          if ($scope.transactions[i]._id == transaction._id) {
            $scope.transactions.splice(i, 1);
            $scope.paginate();
            $scope.reset();
            theProject.transactionWatch++;
            break;
          }
        }
      }, function(data) {
        $scope.error = data.data;
      });  
      $scope.reset();
      theProject.transactionWatch++;
    }
    
    $scope.edit = function(transaction) {
      $scope.transaction = transaction;
    }
    
    $scope.reset = function() {
      $scope.transaction = { type: 1 };
    }
    
    $scope.reset();
    
    $scope.filter = function(transaction) {
      if (theProject.filters.categories.length && theProject.filters.categories.indexOf(transaction.category) < 0) {
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
      if (typeof(theProject.filters) == 'object') {
        $scope.paginate();
      }
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
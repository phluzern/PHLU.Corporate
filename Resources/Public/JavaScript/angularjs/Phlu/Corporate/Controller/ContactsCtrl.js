

// Phlu.Corporate:Page.View.Default filter tag navigation
PhluCorporateApp.controller('ContactsCtrl', ['$scope','$timeout',function($scope,$timeout) {



        $scope.detail = false;
        $scope.promise = false;

       $scope.hoverIn = function(e) {

           if ($scope.promise) $timeout.cancel($scope.promise);

           if ($(e.target).parent().attr('href') === undefined) {
               $scope.promise = $timeout(function() {
                   $scope.detail = true;
               },500);
           } else {

           }




       }

       $scope.hoverOut = function() {
           if ($scope.promise) $timeout.cancel($scope.promise);
           $scope.detail = false;
       }


        $scope.init = function(e) {
           $(e).removeClass('invisible');

       }


}]);



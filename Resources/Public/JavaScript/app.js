'use strict';

    var phluAppModule = angular.module('phluApp', []).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('}}}');
        $interpolateProvider.endSymbol('}}}');
    }).config(function ($anchorScrollProvider) {
        $anchorScrollProvider.disableAutoScrolling();
    })


    .controller('SubjectsFilterNavCtrl', ['$scope',function($scope) {


        $scope.filter = {};
        $scope.filter[0] = true;
        $scope.filteredIn = {};
        $scope.filterItems = {};

        $scope.toggleFilter = function(id) {

            if (id !== 0) delete $scope.filter[0];

            if ($scope.filter[id] === undefined) {
                $scope.filter[id] = true;
            } else {
                delete $scope.filter[id];
            }

            if (Object.keys($scope.filter).length === 0) $scope.filter[0] = true;

console.log(1);

        };

        $scope.addFilterItem = function(nodeId,filterId) {
            if ($scope.filterItems[nodeId] === undefined) $scope.filterItems[nodeId] = {};
            $scope.filterItems[nodeId][filterId] = true;
        };

        $scope.$watch('filter', function(filter) {
            console.log($scope.filteredIn);
            $scope.filteredIn = {};

            angular.forEach($scope.filterItems, function (val, nodeId) {

                if (filter[val] !== undefined) {
                    $scope.filteredIn[nodeId] = true;
                }

            });




        });



    }]);




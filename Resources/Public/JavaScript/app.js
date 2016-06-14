'use strict';

    var phluAppModule = angular.module('phluApp', []);



    // PHLU.Corporate:Page.View.Default filter tag navigation
    phluAppModule.controller('SubjectsFilterNavCtrl', ['$scope','$timeout',function($scope,$timeout) {


        $scope.filter = {};
        $scope.filter[0] = true;
        $scope.filterAll = {};
        $scope.filteredIn = {};
        $scope.filteredOut = {};
        $scope.filterItems = {};


        $scope.toggleFilter = function(id) {

            if (id !== 0) {
                delete $scope.filter[0];


                if ($scope.filter[id] === undefined) {
                    $scope.filter[id] = true;
                } else {
                    delete $scope.filter[id];
                }
            }


            if (Object.keys($scope.filter).length === 0) $scope.filter[0] = true;

            $scope.filteredIn = {};
            angular.forEach($scope.filterItems, function (tags, nodeId) {

                if (id == 0) {
                    $scope.filteredIn[nodeId] = true;
                } else {
                    // filter items by tag
                    angular.forEach(tags, function (val, tag) {
                        if ($scope.filter[tag] !== undefined) {
                            $scope.filteredIn[nodeId] = true;
                        }
                    });
                }


                $scope.filteredOut = {};
                if ($scope.filteredIn[nodeId] === undefined) {
                    $scope.filteredIn[nodeId] = false;

                    $timeout(function() {
                        $scope.filteredOut[nodeId] = true;
                    }, 600);

                }
            });

            if (id === 0) {
                $scope.filter[id] = $scope.filter[id] ? false : true;

                    angular.forEach($scope.filterAll, function (val,nodeId) {
                        if (nodeId !== 0) {
                            $scope.filter[nodeId] = $scope.filter[id] ? false : true;
                        }
                    });
             }

        };

        $scope.addFilterItem = function(nodeId,filterId) {
            if ($scope.filterItems[nodeId] === undefined) $scope.filterItems[nodeId] = {};
            $scope.filterItems[nodeId][filterId] = true;
        };




    }]);




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

            // reset filtered items
            $scope.filteredIn = {};
            $scope.filteredOut = {};


            // unset filter all if other filters are set
            if (id !== 0) {
                delete $scope.filter[0];
                if ($scope.filter[id] === undefined || $scope.filter[id] === false) {
                    $scope.filter[id] = true;
                } else {
                    delete $scope.filter[id];
                }
            }

            // toggle filter all
            if (id === 0) {
                $scope.filter[id] = $scope.filter[id] ? false : true;

                angular.forEach($scope.filterAll, function (val,nodeId) {
                    if (nodeId !== 0) {
                        if (nodeId === id) {
                            $scope.filter[nodeId] = true;
                        } else {
                            $scope.filter[nodeId] = $scope.filter[id] ? false : true;
                        }
                    }


                });
            }

            // set filter all if no other filters are set
            if (Object.keys($scope.filter).length === 0) $scope.filter[0] = true;


            // apply filters to items list
            angular.forEach($scope.filterItems, function (tags, nodeId) {

                if (id == 0) {
                    // filter in all items
                    $scope.filteredIn[nodeId] = true;
                } else {
                    // filter in items by tag
                    angular.forEach(tags, function (val, tag) {
                        if ($scope.filter[tag] !== undefined && $scope.filter[tag] !== false) {
                            $scope.filteredIn[nodeId] = true;
                        }
                    });
                }

                if ($scope.filteredIn[nodeId] === undefined) {
                    $scope.filteredIn[nodeId] = false;

                    $timeout(function() {
                        $scope.filteredOut[nodeId] = true;
                    }, 500);

                }
            });





        };

        $scope.addFilterItem = function(nodeId,filterId) {
            if ($scope.filterItems[nodeId] === undefined) $scope.filterItems[nodeId] = {};
            $scope.filterItems[nodeId][filterId] = true;
        };




    }]);




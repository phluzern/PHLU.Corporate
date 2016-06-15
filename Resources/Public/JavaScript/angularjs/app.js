'use strict';

    var phluAppModule = angular.module('phluApp', ['ngCookies']);



    // PHLU.Corporate:Page.View.Default filter tag navigation
    phluAppModule.controller('SubjectsFilterNavCtrl', ['$scope','$timeout','$cookies',function($scope,$timeout,$cookies) {



        $scope.appId = null;
        $scope.filter = {};
        $scope.filter[0] = true;
        $scope.filterAll = {};
        $scope.filteredIn = {};
        $scope.filteredOut = {};
        $scope.filterItems = {};


        $scope.toggleFilter = function(id) {


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

            // apply filters
            if (id == 0) {
                // filter in all items
                $scope.filteredIn = {};
                $scope.filteredOut = {};
            } else {
                $scope.applyFilters(id);
            }

            $cookies.put($scope.appId, JSON.stringify({'filter': $scope.filter}));

        };

        $scope.applyFilters = function(animate) {


            // apply filters to items list
            angular.forEach($scope.filterItems, function (tags, nodeId) {

                    // filter in items by tag
                    var found = false;
                    angular.forEach(tags, function (val, tag) {
                        if ($scope.filter[tag] !== undefined && $scope.filter[tag] !== false) {
                            found = true;
                        }
                    });

                    $scope.animate = true;
                    if (found === false) {
                        $scope.filteredIn[nodeId] = false;
                        $timeout(function () {
                            $scope.filteredOut[nodeId] = true;
                            $scope.filteredIn[nodeId] = false;
                        }, animate === false ? 0 : 500);
                    } else {
                        $scope.filteredOut[nodeId] = false;
                        $scope.filteredIn[nodeId] = true;
                    }
          
            });
        }


        $scope.addFilterItem = function(nodeId,filterId) {
            if ($scope.filterItems[nodeId] === undefined) $scope.filterItems[nodeId] = {};
            $scope.filterItems[nodeId][filterId] = true;
        };


        // apply last states from cookies
        $scope.$watch("appId", function(appId) {
            $scope.filter = $cookies.get(appId) ? JSON.parse($cookies.get(appId)).filter : {};
            if ($cookies.get(appId)) $scope.applyFilters(false);
        })



    }]);




// PHLU.Corporate:Page.View.Default filter tag navigation
PHLUCorporateApp.controller('SubjectsFilterNavCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$timeout', '$cookies', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $timeout, $cookies) {


    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.search = '';
    $scope.distinctUri = [];
    $scope.appId = null;
    $scope.filter = {};
    $scope.filter[0] = true;
    $scope.filterAll = {};
    $scope.filteredIn = {};
    $scope.filteredOut = {};
    $scope.filterItems = {};
    $scope.filterItemsWithPath = {};

    $scope.animated = true;


    $scope.list
        .$bind('result', $scope)
        .setNodeType(['phlu-corporate-text', 'phlu-corporate-headline','phlu-corporate-contact'])
        .setNodePath('/faecher-und-schwerpunkte')
        .setNodeTypeLabels({'*': 'Seiten'})
        .setGroupedBy({'Seiten': 'url'})
        .setQuery('search', $scope)
        .$watch(function (data) {

            var distinctUri = [];
            angular.forEach(data.getNodes(), function (node) {
                if (node.getScore() > 0.9) {
                    distinctUri.push(node.uri.path);
                }
            });


            angular.forEach($scope.filterItemsWithPath, function (path,item) {

                if ($scope.search !== '' && distinctUri.indexOf(path) == -1) {
                    $scope.filteredIn[item] = false;
                    $scope.filteredOut[item] = true;
                } else {
                    $scope.filteredOut[item] = false;
                    $scope.filteredIn[item] = true;
                }

            });



            setTimeout(function () {
                $scope.$apply(function () {



                    $scope.distinctUri = distinctUri;
                  //  console.log(distinctUri);
                });
            }, 10);

        });



    $scope.toggleFilter = function (id) {


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

            angular.forEach($scope.filterAll, function (val, nodeId) {
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
            $scope.applyFilters(true);
        }

        $cookies.put($scope.appId, JSON.stringify({'filter': $scope.filter}));

    };

    $scope.applyFilters = function (animated) {

        $scope.animated = animated === true ? true : false;

        // apply filters to items list
        angular.forEach($scope.filterItems, function (tags, nodeId) {

            // filter in items by tag
            var found = false;
            angular.forEach(tags, function (val, tag) {
                if ($scope.filter[tag] !== undefined && $scope.filter[tag] !== false) {
                    found = true;
                }
            });


            if (found === false) {
                $scope.filteredIn[nodeId] = false;
                $timeout(function () {
                    $scope.filteredOut[nodeId] = true;
                    $scope.filteredIn[nodeId] = false;
                }, animated === false ? 0 : 500);
            } else {
                $scope.filteredOut[nodeId] = false;
                $scope.filteredIn[nodeId] = true;
            }

        });
    }


    $scope.addFilterItem = function (nodeId, filterId,path) {

        if ($scope.filterItems[nodeId] === undefined) $scope.filterItems[nodeId] = {};
        $scope.filterItems[nodeId][filterId] = true;

        if ($scope.filterItemsWithPath[nodeId] === undefined) {
            $scope.filterItemsWithPath[nodeId] = {};
        }
        if (path !== undefined) {
            $scope.filterItemsWithPath[nodeId] = path;
        }


    };


    // apply last states from cookies
    $scope.$watch("appId", function (appId) {
        if ($("#" + appId).find(".ng-tag").length === 0) $cookies.remove(appId);
        $scope.filter = $cookies.get(appId) ? JSON.parse($cookies.get(appId)).filter : {};
        if ($cookies.get(appId)) $scope.applyFilters(false);
    })


}]);






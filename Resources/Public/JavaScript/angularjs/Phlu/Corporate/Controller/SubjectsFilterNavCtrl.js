// Phlu.Corporate:Page.View.Default filter tag navigation
PhluCorporateApp.controller('SubjectsFilterNavCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$timeout', '$cookies', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $timeout, $cookies) {


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
    $scope.ishidden = true;

    $scope.animated = true;


    var boost = {

        'phlu-corporate-contact-firstname': 50,
        'phlu-corporate-contact-lastname': 50,
        'phlu-corporate-contact-education': -1, // dont'search here
        'phlu-corporate-contact-activities': -1, // dont'search here
        'phlu-corporate-contact-function': 10,
        'phlu-corporate-contact-functions': -1,
        'phlu-corporate-contact-consulting': -1, // dont'search here
        'phlu-corporate-contact-expertise': -1, // dont'search here
        'phlu-corporate-contact-functioncustom': -1, // dont'search here
        'phlu-corporate-contactsgroup.phlu-corporate-contact-firstname': 60,
        'phlu-corporate-contactsgroup.phlu-corporate-contact-lastname': 60,
        'phlu-corporate-contact-phone': 10


    };


    $scope.list
        .$bind('result', $scope)
        .setPropertiesBoost(boost)
        .setNodePath(window.location.pathname.substr(0,window.location.pathname.length - 5))
        .setQuery('search', $scope);


    $scope.toggleFilter = function(id) {


        $scope.filter = {};

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
        // if (id === 0) {
        //     angular.forEach($scope.filterAll, function (val,nodeId) {
        //         if (nodeId !== 0) {
        //             if (nodeId === id) {
        //                 $scope.filter[nodeId] = true;
        //             } else {
        //                 $scope.filter[nodeId] = $scope.filter[id] ? false : true;
        //             }
        //         }
        //
        //     });
        // }


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

    $scope.applyFilters = function(animated) {



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
                }, animated === false ? 0 : 0);
            } else {
                $scope.filteredOut[nodeId] = false;
                $scope.filteredIn[nodeId] = true;
            }

        });


    }


    $scope.addFilterItem = function(nodeId,filterId) {
        if ($scope.filterItems[nodeId] === undefined) $scope.filterItems[nodeId] = {};
        $scope.filterItems[nodeId][filterId] = true;
        $scope.ishidden = false;
    };


    // apply last states from cookies
    $scope.$watch("appId", function(appId) {
        if ($("#"+appId).find(".ng-tag").length === 0) $cookies.remove(appId);
        $scope.filter = $cookies.get(appId) ? JSON.parse($cookies.get(appId)).filter : {};
        if ($cookies.get(appId)) $scope.applyFilters(false);
    })

    // apply last states from cookies
    $scope.$watch("filterItems", function(filteritems) {
        if ($cookies.get($scope.appId)) $scope.applyFilters(false);
    },true);



}]);



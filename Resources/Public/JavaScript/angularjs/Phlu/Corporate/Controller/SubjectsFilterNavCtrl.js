// Phlu.Corporate:Page.View.Default filter tag navigation
PhluCorporateApp.controller('SubjectsFilterNavCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$timeout', '$cookies', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $timeout, $cookies) {


    var list = new $hybridsearchObject(hybridsearch);
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
    $scope.autocompleteLastPosition = 0;

    $scope.animated = true;


    var boost = {

        'phlu-corporate-contact-image': -1,
        'phlu-corporate-contact-city': -1,
        'phlu-corporate-contact-organisations': -1,
        'phlu-corporate-contact-portrait': -1,
        'phlu-corporate-contact-zip': -1,
        'phlu-corporate-contact-consulting': -1,
        'phlu-corporate-contact-education': -1,
        'phlu-corporate-contact-expertise': -1,
        'phlu-corporate-contact-title': -1

    };


    list
        .enableCache()
        .$bind('result', $scope)
        .setPropertiesBoost(boost)
        //.setNodeType(['phlu-corporate-contact','phlu-corporate-text'])
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


        if ($scope.filter[0] == undefined) {


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


    }


    $scope.getParentUriSegment = function(uri) {
        if (uri !== undefined) {
            var e = uri.split("/");
            var b = "";
            var l = Object.keys(e).length;
            angular.forEach(e,function(v,k) {
               if (k < l-1) {
                   if (b !== "") {
                       b = b+"/";
                   }
                   b = b+v;
               }
            });
            b = "/"+b+".html";
            return b;
        }
        return uri;
    };

    $scope.addFilterItem = function(nodeId,filterId) {
        if ($scope.filterItems[nodeId] === undefined) $scope.filterItems[nodeId] = {};
        $scope.filterItems[nodeId][filterId] = true;

        $scope.ishidden = false;

    };


    // apply last states from cookies
    $scope.$watch("appId", function(appId) {
        if ($("#"+appId).find(".ng-tag").length === 0) $cookies.remove(appId);
        $scope.filter = $cookies.get(appId) ? JSON.parse($cookies.get(appId)).filter : {};
        if ($cookies.get(appId)) {
            $scope.applyFilters(false);
        }
    })

    // apply last states from cookies
    $scope.$watch("filterItems", function(filteritems) {
        if ($cookies.get($scope.appId)) $scope.applyFilters(false);
    },true);



    // autocomplate$
    var keybinded = false;

    $scope.$watch('searchquery',function() {

        if (keybinded == false) {
            jQuery(document).keydown(function (e) {



                if (jQuery(e.target).hasClass('searchQueryInput')) {

                    switch (e.which) {

                        case 13: // enter
                            //$rootScope.siteSearch = $rootScope.autocomplete[$rootScope.autocompleteLastPos];
                            jQuery(e.target).val($scope.result.getAutocomplete()[$scope.autocompleteLastPosition]).blur();
                            break;

                        case 38: // up
                            $scope.autocompleteLastPosition--;
                            var el = document.getElementById(jQuery(e.target).attr('id'));
                            if (el) {
                                window.setTimeout(function () {
                                    if (typeof el.selectionStart == "number") {
                                        el.selectionStart = el.selectionEnd = el.value.length;
                                    } else if (typeof el.createTextRange != "undefined") {
                                        el.focus();
                                        var range = el.createTextRange();
                                        range.collapse(false);
                                        range.select();
                                    }
                                }, 1);
                            }
                            break;

                        case 40: // down
                            $scope.autocompleteLastPosition++;
                            break;

                        default:
                            $scope.autocompleteLastPosition = 0;
                            return; // exit this handler for other keys
                    }


                    if ($scope.autocompleteLastPosition < 0) {
                        $scope.autocompleteLastPosition = 0;
                    }
                    if ($scope.autocompleteLastPosition >= $scope.result.countAutocomplete()) {
                        $scope.autocompleteLastPosition = $scope.result.countAutocomplete() - 1;
                    }

                    window.setTimeout(function () {
                        $scope.$digest();
                    }, 1);
                    //search.$$app.search(null, null, $rootScope.autocomplete[$rootScope.autocompleteLastPos]);

                }
            });
        }
        keybinded = true;

    });


}]);



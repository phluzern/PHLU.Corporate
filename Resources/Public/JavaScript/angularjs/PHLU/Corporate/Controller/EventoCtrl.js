PhluCorporateApp.controller('EventoCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.limit = 15;
    $scope.limitChunkSize = 15;
    $scope.initialFilters = {};
    $scope.graduation = {};
    $scope.nodetypes = [];
    $scope.searchquery = '';

    $scope.setQuery = function (value) {
        $scope.list.setQuery(value, $scope);
    };

    $scope.setFiltergraduation = function (f) {
        $scope.initialFilters['graduation'] = true;
        $scope.graduation = f;
    };

    $scope.loadMore = function () {
        $scope.limit = $scope.limit + $scope.limitChunkSize;
    };

    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };

    $scope.clearFilter = function (filtertype) {
        $scope[filtertype] = {};
    };

    $scope.setNodeTypes = function (nodetypes) {
        $scope.nodetypes = nodetypes;
    };

    $scope.list
        .setOrderBy({'phlu-neos-nodetypes-course-study-furthereducation': 'nr'})
        .addPropertyFilter('graduation', 'graduation', $scope)
        .setNodeType('nodetypes', $scope)
        //.addPropertyFilter('title', '', null, true)
        .$bind('result', $scope)
        .run();


}]);

PhluCorporateApp.controller('EventoFurtherEducationCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    var search = new $hybridsearchObject(hybridsearch);
    var searchAll = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.resultAll = new $hybridsearchResultsObject();
    $scope.limit = 15;
    $scope.limitChunkSize = 15;
    $scope.searchquery = '';
    $scope.graduation = {};
    $scope.nodetypes = [];
    $scope.nodetypesFilter = [
        {id: 'all', label: 'Alle', category: 'Alle'},
        {id: 'phlu-neos-nodetypes-course-study-furthereducation', label: 'Studiengänge', category: 'Studiengang'},
        {id: 'phlu-neos-nodetypes-course-module-furthereducation', label: 'Kurse', category: 'Kurs'}
    ];

    $scope.nodetypesFilterCurrentLabel = 'Alle';
    $scope.nodetypesFilterCurrentCategory = 'Alle';
    $scope.filters = {
        'graduation': {
            'property': 'graduation',
            'selected': {},
            'categories': ['Studiengang']
        },
        'year': {
            'property': 'years.Year',
            'selected': {},
            'categories': ['Studiengang', 'Kurs', 'Alle']
        }
    };

    $scope.$watch('filters', function (filters) {
        angular.forEach(filters, function (filter) {
            filter.selectedValues = $scope.getFilterSelectedValue(filter);
        });
    }, true);

    $scope.$watch('nodetypesFilterCurrentCategory', function () {
        angular.forEach($scope.filters, function (filter) {
            filter.selectedValues = $scope.getFilterSelectedValue(filter);
        });
    });


    $scope.$watch('searchquery', function (f) {
        //console.log(f);
    }, true);


    /**
     * @public
     * Set node type filter
     * @param filter
     * @returns void
     */
    $scope.setNodetypesFilter = function (filter) {

        angular.forEach($scope.nodetypesFilter, function (val, key) {
            val.state = false;
        });

        filter.state = true;


        $scope.nodetypesFilterCurrentLabel = filter.label;
        $scope.nodetypesFilterCurrentCategory = filter.category;


        var nodetype = [];
        angular.forEach($scope.nodetypesFilter, function (val, key) {
            if (val.state || filter.id == 'all') {
                if (val.id !== 'all') {
                    nodetype.push(val.id);
                }
            }

        });

        $scope.nodetypes = nodetype;

    }


    /**
     * @private
     * Get filter from filter object
     * @param filterObject
     * @returns filter
     */
    function getFilterFromFilterObject(filterObject) {

        var filter = null;
        angular.forEach($scope.filters, function (val, key) {
            if (key == filterObject.property || val.property == filterObject.property) {
                filter = val;
            }
        });

        return filter;

    }

    /**
     * @private
     * Get filter by name
     * @param filterObject
     * @returns filter
     */
    function getFilterByName(name) {

        var filter = null;
        angular.forEach($scope.filters, function (val, key) {
            if (key == name) {
                filter = val;
            }
        });

        return filter;

    }

    /**
     * @public
     * Toggle state of given filter
     * @param filterObject
     * @param category
     * @param string filter name
     * @returns filterObject
     */
    $scope.toggleFilterSelection = function (filterObject, category, filtername) {

        if (category == undefined) {
            category = 'all';
        }


        var filter = getFilterByName(filtername);

        if (filter === null) {
            filter = getFilterFromFilterObject(filterObject);
        }

        if (filter === null) {
            return null;
        }


        if (filter.selected[category] === undefined) {
            filter.selected[category] = {};
        }

        if (filter.selected[category][filterObject.id] === undefined) {
            filter.selected[category][filterObject.id] = filterObject;
        }

        filter.selected[category][filterObject.id].state = filter.selected[category][filterObject.id].state ? false : true;


        return filterObject;


    };


    /**
     * @public
     * Get filters selected preview text
     * @param filter filter
     * @param string category
     * @returns string
     */
    $scope.getFilterSelectedPreview = function (filter, category) {

        if (category == undefined) {
            category = 'all';
        }


        var text = '';

        if (filter.selected[category] === undefined) {
            return text;
        }

        angular.forEach(filter.selected[category], function (selected) {


            if (selected.state) {
                if (text !== '') {
                    text += ", ";
                }
                text += selected.value;
            }
        });

        return text;

    };

    /**
     * @public
     * Get filters selected preview text
     * @returns array
     */
    $scope.getFilterSelectedValue = function (filter) {

        var value = [];

        angular.forEach(filter.selected[$scope.nodetypesFilterCurrentCategory], function (selected) {
            if (selected.state) {
                value.push(selected.value);
            }
        });

        return value;

    };

    /**
     * @public
     * Reset current filters
     * @returns filters
     */
    $scope.resetFilters = function () {

        angular.forEach($scope.filters, function (filter) {
            filter.selected = {};
        });

        return $scope.filters;

    };

    /**
     * @public
     * Toggle visibility of news
     * @returns filters
     */
    $scope.toggleNews = function () {

        if ($scope.showNews === undefined) {
            $scope.showNews = true;
        }
        $scope.showNews = $scope.showNews ? false : true;

    };

    /**
     * @public
     * Count current filters
     * @param string category
     * @returns integer
     */
    $scope.isShowingResult = function () {


        if ($scope.searchquery !== '') {
            return true;
        }

        if ($scope.resultAll.isStarted() == false || $scope.resultAll.isLoading() || $scope.resultAll.count() === 0) {
            return false;
        }

        if ($scope.countCurrentFilters($scope.nodetypesFilterCurrentCategory) > 0) {
            return true;
        }

        if ($scope.nodetypesFilterCurrentLabel !== 'Alle') {

            return true;
        }

        return false;

    }


    /**
     * @public
     * Count current filters
     * @param string category
     * @returns integer
     */
    $scope.countCurrentFilters = function (category) {


        var counter = 0;
        angular.forEach($scope.filters, function (filter) {
            angular.forEach(filter, function (selected) {
                if (typeof selected[category] == 'object') {
                    angular.forEach(selected[category], function (item) {

                        if (category == undefined || item.state === true) {
                            counter++;
                        }
                    });
                }
            });
        });

        return counter;

    };

    /**
     * @private
     * Set node type filters
     * @returns integer
     */
    $scope.setNodetypesFilter($scope.nodetypesFilter[0]);

    /**
     * @private
     * Load more
     * @returns integer
     */
    $scope.loadMore = function () {
        $scope.limit = $scope.limit + $scope.limitChunkSize;
    };

    /**
     * @private
     * get size of object helper
     * @returns integer
     */
    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };


    /**
     * @private
     * Initialize hybridsearch list
     */
    search
        .setQuery('searchquery', $scope)
        .setNodeType('nodetypes', $scope)
        .$bind('result', $scope);

    angular.forEach($scope.filters, function (filter, name) {
        search.addPropertyFilter(filter.property, 'filters.' + name + '.selectedValues', $scope);
    });

    search.$watch(function (result) {
        //console.log(result);
    });

    search.run();


    /**
     * @private
     * Initialize hybridsearch distincts
     */
    searchAll
        .setNodeType(['phlu-neos-nodetypes-course-study-furthereducation', 'phlu-neos-nodetypes-course-module-furthereducation'])
        .$bind('resultAll', $scope)
        .run();


}]);


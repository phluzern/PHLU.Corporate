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
        {state: false, id: 'all', label: 'Alle'},
        {state: false, id: 'phlu-neos-nodetypes-course-study-furthereducation', label: 'Studiengang'},
        {state: false, id: 'phlu-neos-nodetypes-course-module-furthereducation', label: 'Kurse'}
    ];

    $scope.nodetypesFilterCurrentLabel = 'Alle';
    $scope.filters = {
        'graduation': {
            'property': 'graduation',
            'selected': {},
            'category': 'Studiengang'
        }
    };

    $scope.$watch('filters',function(filters) {
        angular.forEach(filters,function(filter) {
            filter.selectedValues = $scope.getFilterSelectedValue(filter);
        });
    },true);


    $scope.$watch('searchquery',function(f) {
       console.log(f);
    },true);



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
     * @public
     * Toggle state of given filter
     * @param filterObject
     * @returns filterObject
     */
    $scope.toogleFilterSelection = function (filterObject) {

        if ($scope.filters[filterObject.property] === undefined) {
            return null;
        }

        if ($scope.filters[filterObject.property].selected[filterObject.id] === undefined) {
            filterObject.state = true;
            $scope.filters[filterObject.property].selected[filterObject.id] = filterObject;
        } else {
            $scope.filters[filterObject.property].selected[filterObject.id].state = $scope.filters[filterObject.property].selected[filterObject.id].state ? false : true;
        }

        return filterObject;


    };


    /**
     * @public
     * Get filters selected preview text
     * @returns string
     */
    $scope.getFilterSelectedPreview = function (filter) {

        var text = '';
        angular.forEach(filter.selected, function (selected) {
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
        angular.forEach(filter.selected, function (selected) {
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
        console.log($scope.showNews);

    };

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
                if (typeof selected == 'object') {
                    angular.forEach(selected, function (item) {
                        if (item.state && (category == undefined || $scope.filters[item.property].category == category)) {
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
        .setOrderBy({'phlu-neos-nodetypes-course-study-furthereducation': 'nr'})
        .setNodeType('nodetypes', $scope)
        .$bind('result', $scope);

    angular.forEach($scope.filters, function(filter,name) {
       search.addPropertyFilter(filter.property, 'filters.'+name+'.selectedValues', $scope);
    });

    search.$watch(function(result) {
       // console.log(result);
    });

    search.run();


    /**
     * @private
     * Initialize hybridsearch distincts
     */
    searchAll
        .setNodeType(['phlu-neos-nodetypes-course-study-furthereducation','phlu-neos-nodetypes-course-module-furthereducation'])
        .$bind('resultAll', $scope)
        .run();


}]);


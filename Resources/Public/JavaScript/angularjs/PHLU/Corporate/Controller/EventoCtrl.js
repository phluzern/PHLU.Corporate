PhluCorporateApp.controller('EventoCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.limit = 15;
    $scope.limitChunkSize = 15;
    $scope.initialFilters = {};
    $scope.graduation = {};
    $scope.nodetypes = [];

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

    $scope.clearFilter = function(filtertype) {
        $scope[filtertype] = {};
    };

    $scope.setNodeTypes = function(nodetypes) {
        $scope.nodetypes = nodetypes;
    };

    $scope.list
        .setOrderBy({'phlu-neos-nodetypes-course-study-furthereducation': 'nr'})
        .addPropertyFilter('graduation', 'graduation', $scope)
        .setNodeType('nodetypes',$scope)
        //.addPropertyFilter('title', '', null, true)
        .$bind('result', $scope)
        .run();


}]);

PhluCorporateApp.controller('EventoFurtherEducationCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    var search = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.limit = 15;
    $scope.limitChunkSize = 15;
    $scope.graduation = {};
    $scope.nodetypes = [];
    $scope.nodetypesFilter = [

        {state:false, id: 'all', label: 'Alle'},
        {state:false, id: 'phlu-neos-nodetypes-course-study-furthereducation', label: 'Studiengang'},
        {state:false, id: 'phlu-neos-nodetypes-course-module-furthereducation', label: 'Kurse'}

    ];

    $scope.nodetypesFilterCurrentLabel = 'Alle';

    $scope.setNodetypesFilter = function(filter) {

        angular.forEach($scope.nodetypesFilter, function (val,key) {
            val.state = false;
        });
        filter.state = true;
        $scope.nodetypesFilterCurrentLabel = filter.label;

        var nodetype = [];
            angular.forEach($scope.nodetypesFilter, function (val,key) {
                if (val.state || filter.id == 'all') {
                    if (val.id !== 'all') {
                        nodetype.push(val.id);
                    }
                }

            });

        $scope.nodetypes = nodetype;

    }

    $scope.setNodetypesFilter($scope.nodetypesFilter[0]);

    $scope.loadMore = function () {
        $scope.limit = $scope.limit + $scope.limitChunkSize;
    };


    $scope.setFilterNodeTypes = function (f) {
       // $scope.initialFilters['nodetypes']
    };

    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };

    $scope.clearFilter = function(filtertype) {
        $scope[filtertype] = {};
    };

    search
        .setQuery('search',$scope)
        .setOrderBy({'phlu-neos-nodetypes-course-study-furthereducation': 'nr'})
        .addPropertyFilter('graduation', 'graduation', $scope)
        .setNodeType('nodetypes',$scope)
        .$bind('result', $scope)
        .run();

}]);


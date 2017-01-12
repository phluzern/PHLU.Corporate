PHLUCorporateApp.controller('EventoCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.limit = 15;
    $scope.limitChunkSize = 15;
    $scope.initialFilters = {};
    $scope.graduation = {};

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

    $scope.list
        //.setOrderBy({'phlu-neos-nodetypes-project': 'title'})
        .addPropertyFilter('graduation', 'graduation', $scope)
        .setNodeType('phlu-neos-nodetypes-course-study-furthereducation')
        //.addPropertyFilter('title', '', null, true)
        .$bind('result', $scope);


}]);


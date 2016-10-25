PHLUCorporateApp.controller('PpdbCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    var search = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.filter = {
        'lifetime': {}
    };


    search.setQuery("search", $scope).addPropertyFilter('title', '', null, true).addPropertyFilter('lifetime', 'filter.lifetime', $scope).setNodeType('phlu-neos-nodetypes-project').$watch(function (data) {

        $scope.result = data;

        $scope.$apply(function () {

        });

    });

}]);


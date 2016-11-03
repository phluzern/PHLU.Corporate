PHLUCorporateApp.controller('PpdbCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.search = '';
    $scope.filterLifetime = [];

    $scope.list
        .addPropertyFilter('lifetime', 'filterLifetime', $scope)
        .setNodeType('phlu-neos-nodetypes-project')
        .addPropertyFilter('title', '', null, true)
        .$bind('result',$scope)


}]);


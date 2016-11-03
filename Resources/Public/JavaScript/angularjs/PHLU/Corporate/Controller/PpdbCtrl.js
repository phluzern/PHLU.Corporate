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


    $scope.$watch('filterLifetime',function(i) {
        console.log($scope.list.$$app.getFilter());

    });


    //var search2 = new $hybridsearchObject(hybridsearch);
    //$scope.result = new $hybridsearchResultsObject();
    //$scope.lifetime = {};

    // .addNodesByIdentifier(['fsdfsdf-fsdffsdf'.'fsdfsdfdf-fsdfsdfsdf'])
    //search.setQuery("search", $scope).addPropertyFilter('title', '', null, true).addPropertyFilter('lifetime', 'lifetime', $scope).setNodeType('phlu-neos-nodetypes-project').$bind('result',$scope);


    // search.setQuery("search", $scope)
    //     .setQuery("search", $scope)
    //     .addPropertyFilter('title', '', null, true)
    //     .addPropertyFilter('lifetime', 'lifetime', $scope)
    //     .setNodeType('phlu-neos-nodetypes-project')
    //     .$bind('result', $scope);



}]);


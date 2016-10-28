PHLUCorporateApp.controller('PpdbCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    var search = new $hybridsearchObject(hybridsearch);
    var search2 = new $hybridsearchObject(hybridsearch);
    //$scope.result = new $hybridsearchResultsObject();
    $scope.lifetime = {};

    // .addNodesByIdentifier(['fsdfsdf-fsdffsdf'.'fsdfsdfdf-fsdfsdfsdf'])

    //search.setQuery("search", $scope).addPropertyFilter('title', '', null, true).addPropertyFilter('lifetime', 'lifetime', $scope).setNodeType('phlu-neos-nodetypes-project').$bind('result',$scope);


    search.setQuery("search", $scope)
        .setQuery("search", $scope)
        .addPropertyFilter('title', '', null, true)
        .addPropertyFilter('lifetime', 'lifetime', $scope)
        .addNodesByNodeTypes(['phlu-neos-nodetypes-project'])
        .$bind('result', $scope);


}]);


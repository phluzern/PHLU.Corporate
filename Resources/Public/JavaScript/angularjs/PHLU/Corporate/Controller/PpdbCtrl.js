PHLUCorporateApp.controller('PpdbCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    var search = new $hybridsearchObject(hybridsearch);
    var search2 = new $hybridsearchObject(hybridsearch);
    //$scope.result = new $hybridsearchResultsObject();
    $scope.lifetime = {};

    // .addNodesByIdentifier(['fsdfsdf-fsdffsdf'.'fsdfsdfdf-fsdfsdfsdf'])

   //search.setQuery("search", $scope).addPropertyFilter('title', '', null, true).addPropertyFilter('lifetime', 'lifetime', $scope).setNodeType('phlu-neos-nodetypes-project').$bind('result',$scope);


    search2.
    setQuery("search", $scope)
        .addPropertyFilter('lifetime', 'lifetime', $scope)
        .addNodesByIdentifier(['b0336355-cd57-4df8-8e96-4fa1c1da8515'])
        .addNodesByIdentifier(['2f001a87-4b12-49ad-9fb6-10aacf7a5ecb'])
        .addNodesByIdentifier(['4e765d45-4c4e-4c3e-ba5c-914f6a55d45b','e4c48445-be76-4445-b7db-d6168fb4fe19'])
 
        .$bind('result',$scope);



}]);


PHLUCorporateApp.controller('PpdbCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.search = '';
    $scope.filterLifetime = {};

    $scope.financingtype = {};
    $scope.ppdbstatuslifetime = {};
    $scope.projectparticipants = {};
    $scope.researchmainfocus = {};

    $scope.addPropertyFilter = function (property, value) {
        $scope.list.addPropertyFilter(property, value, $scope);
    }

    $scope.setQuery = function (value) {
        $scope.list.setQuery(value, $scope);
    }

    $scope.setFilterLifetime = function (filterLifetime) {
        angular.forEach(filterLifetime, function (filter) {
            $scope.filterLifetime[filter] = true;
        });

    }

    $scope.list
        .addPropertyFilter('lifetime', 'filterLifetime', $scope)
        .setNodeType('phlu-neos-nodetypes-project')
        .addPropertyFilter('title', '', null, true)
        .$bind('result', $scope);



}])
;


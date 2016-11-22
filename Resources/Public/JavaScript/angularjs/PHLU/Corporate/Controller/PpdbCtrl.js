PHLUCorporateApp.controller('PpdbCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.search = '';
    $scope.filterLifetime = {};
    $scope.financingtype = {};
    $scope.projectparticipants = {};
    $scope.researchmainfocus = {};
    $scope.researchunit = {};
    $scope.initialFilters = {};

    $scope.addPropertyFilter = function (property, value) {
        $scope.list.addPropertyFilter(property, value, $scope);
    }

    $scope.setQuery = function (value) {
        $scope.list.setQuery(value, $scope);
    }

    $scope.setFilterLifetime = function (filterLifetime) {
        $scope.filterLifetime = f;
        $scope.initialFilters['lifetime'] = true;
    };

    $scope.setFilterResearchunit = function (f) {
        $scope.researchunit = f;
        $scope.initialFilters['researchunit'] = true;
    };

    $scope.setFilterFinancingtypes = function (f) {
        $scope.financingtype = f;
        $scope.initialFilters['financingtype'] = true;
    };

    $scope.setFilterProjectparticipants = function (f) {
        $scope.projectparticipants = f;
        $scope.initialFilters['participants'] = true;
    };

    $scope.setFilterResearchmainfocus = function (f) {
        $scope.initialFilters['researchmainfocus'] = true;
        $scope.researchmainfocus = f;
    };


    $scope.list
        .addPropertyFilter('lifetime', 'filterLifetime', $scope)
        .addPropertyFilter('researchmainfocus.ID', 'researchmainfocus', $scope)
        .addPropertyFilter('researchunit.ID', 'researchunit', $scope)
        .addPropertyFilter('financingtypes', 'financingtype', $scope)
        .addPropertyFilter('participants.*.EventoID', 'projectparticipants', $scope)
        .setNodeType('phlu-neos-nodetypes-project')
        .addPropertyFilter('title', '', null, true)
        .$bind('result', $scope);


}]);

PHLUCorporateApp.controller('PpdbPublicationCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.participants = {};
    $scope.initialFilters = {};


    $scope.setFilterParticipants = function (f) {
        $scope.participants = f;
        $scope.initialFilters['participants'] = true;
    };

    $scope.list
        .setNodeType('phlu-neos-nodetypes-publication')
        .addPropertyFilter('title', '', null, true)
        .addPropertyFilter('persons.EventoID', 'participants', $scope)
        .$bind('result', $scope);

}]);


PHLUCorporateApp.filter('projectparticipantsFilter', function () {
    return function (input, term) {

        if (term === undefined || term == '') {
            return input;
        }

        var collection = {};

        angular.forEach(input, function (val, key) {


            if (JSON.stringify(val.value).indexOf(term) >= 0) {
                collection[key] = val;
            }

        });


        return collection;

    };
})
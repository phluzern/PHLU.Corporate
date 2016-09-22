// PHLU.Corporate:Page.View.Default filter tag navigation


PHLUCorporateApp.directive('search', function ($sce) {


    var template = '/_Resources/Static/Packages/PHLU.Corporate/JavaScript/angularjs/PHLU/Corporate/Templates/Search/';

    return {
        template: '<ng-include src="getTemplateUrl()"/>',
        //templateUrl: unfortunately has no access to $scope.user.type
        scope: {
            node: '=data'
        },
        restrict: 'E',
        controller: function ($scope) {

            $scope.getTemplateUrl = function () {


                if ($scope.node.turbonode === true) {
                    //$scope.node.html = $sce.trustAsHtml($scope.node.html);
                    return template + 'turbonode.html';
                } else {

                    switch ($scope.node.nodeType) {
                        case 'phlu-corporate-contact':
                            return template + 'phlu-corporate-contact.html';

                        default:
                            return template + 'default.html';

                    }
                }


            };

        }
    };


});

PHLUCorporateApp.controller('SearchCtrl', ['$scope', '$sce', '$hybridsearch', '$hybridsearchObject', function ($scope, $sce, $hybridsearch, $hybridsearchObject) {

    var hybridsearch = new $hybridsearch(
        'https://phlu-f98dd.firebaseio.com',
        'live',
        'fb11fdde869d0a8fcfe00a2fd35c031d'
    );

    $scope.results = [];
    $scope.siteSearch = '';

    var search = new $hybridsearchObject(hybridsearch);

    search.setQuery('siteSearch', $scope).$watch(function (i) {
        $scope.results = i;
    });




}]);


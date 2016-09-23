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

PHLUCorporateApp.directive('nodeType', function ($sce) {

    var labels = {};


    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.text(labels[attrs.name] !== undefined ? labels[attrs.name] : attrs.name);

        }
    };


});

PHLUCorporateApp.controller('SearchCtrl', ['$scope', '$sce', '$hybridsearch', '$hybridsearchObject', function ($scope, $sce, $hybridsearch, $hybridsearchObject) {

    var hybridsearch = new $hybridsearch(
        'https://phlu-neos.firebaseio.com',
        'live',
        'fb11fdde869d0a8fcfe00a2fd35c031d'
    );

    $scope.results = [];
    $scope.siteSearch = '';
    $scope.siteSearchLastQuery = '';
    var wasClosed = false;


    var search = new $hybridsearchObject(hybridsearch);
    var labels = {

        'phlu-corporate-contact': 'Kontakte',
        'phlu-corporate-headline': 'Seiten',
        'phlu-corporate-page-overview-onepage': 'Seiten',
        'phlu-neos-nodetypes-contentcollection-table-body': 'Seiten',
        'phlu-corporate-table': 'Seiten',
        'phlu-corporate-content-page-headerdefault': 'Seiten',
        'phlu-qmpilot-nodetypes-file': 'Dateien'

    };


    var tabs = $("#searchResultsTabs");
    search.setNodeTypeLabels(labels).setQuery('siteSearch', $scope).addAdditionalKeywords($(".page-header").text() + " " + window.location.href).$watch(function (i) {
        $scope.results = i;
        if (tabs.find("a.active").length === 0) {
            tabs.find("a:first-child").trigger("click");
        }

    });

    $scope.stopSearch = function () {
        $scope.siteSearchLastQuery = $scope.siteSearch;
        $scope.siteSearch = '';
        $scope.results = [];
        wasClosed = true;
    };

    $scope.startSearch = function () {
        if (wasClosed) {
            wasClosed = false;
            $scope.siteSearch = $scope.siteSearchLastQuery;
        }

    };

    $scope.$watch('siteSearch', function (i) {
        if (i === '' && wasClosed == false) {
            $scope.siteSearchLastQuery = '';
        }
    });


}]);


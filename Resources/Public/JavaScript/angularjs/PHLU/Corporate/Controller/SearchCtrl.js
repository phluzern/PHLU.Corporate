// PHLU.Corporate:Page.View.Default filter tag navigation


PHLUCorporateApp.directive('search', function ($sce) {


    var template = '/_Resources/Static/Packages/PHLU.Corporate/JavaScript/angularjs/PHLU/Corporate/Templates/Search/';

    return {
        template: '<ng-include src="getTemplateUrl()"/>',
        scope: {
            node: '=data',
            view: '@view'
        },
        restrict: 'E',
        controller: function ($scope) {

            $scope.getTemplateUrl = function () {

                if ($scope.node === undefined) {
                    return '';
                }

                if ($scope.node.isTurboNode()) {
                    return template + 'turbonode.html';
                } else {
                    switch ($scope.node.getNodeType()) {

                        case 'phlu-corporate-contact':

                            if ($scope.view === 'all') {
                                return template + '/All/phlu-corporate-contact.html';
                            } else {
                                return template + '/Group/phlu-corporate-contact.html';
                            }

                        case 'phlu-qmpilot-nodetypes-file':

                            if ($scope.view === 'all') {
                                return template + '/All/phlu-qmpilot-nodetypes-file.html';
                            } else {
                                return template + '/Group/phlu-qmpilot-nodetypes-file.html';
                            }

                        case 'phlu-neos-nodetypes-project':


                            return template + '/All/phlu-neos-nodetypes-project.html';

                        case 'phlu-neos-nodetypes-publication':


                            return template + '/All/phlu-neos-nodetypes-publication.html';


                        default:
                            return template + '/All/default.html';
                    }
                }


            };

        }
    };


});

PHLUCorporateApp.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
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


PHLUCorporateApp.controller('SearchCtrl', ['$scope', '$rootScope', '$sce', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, $rootScope, $sce, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {


    $scope.result = new $hybridsearchResultsObject();

    $rootScope.siteSearch = '';
    $scope.siteSearch = '';
    $scope.siteSearchLastQuery = '';
    $scope.siteSearchPath = '';
    $scope.siteSearchPathName = '';
    $scope.isSearch = false;
    $scope.lastActiveTabName = 'alle';

    var wasClosed = false;


    var labels = {

        'phlu-corporate-contact': 'Kontakte',
        'phlu-corporate-headline': 'Seiten',
        'phlu-corporate-page-overview-onepage': 'Seiten',
        'phlu-neos-nodetypes-contentcollection-table-body': 'Seiten',
        'phlu-corporate-table': 'Seiten',
        'phlu-corporate-content-page-headerdefault': 'Seiten',
        'phlu-qmpilot-nodetypes-file': 'Dateien',
        'phlu-corporate-image': 'Bilder',
        'phlu-neos-nodetypes-project': 'Projekte',
        'phlu-neos-nodetypes-publication': 'Publikationen'

    };

    var boost = {

        'phlu-corporate-content-page-headerdefault-grandparent': 5,
        'phlu-corporate-contact-grandparent': 10,
        'phlu-corporate-contact-firstname': 10,
        'phlu-corporate-contact-lastname': 10,
        'phlu-corporate-contact-phone': 10,
        'phlu-corporate-contact-email': 10,
        'phlu-corporate-headline-title': 10,
        'phlu-corporate-content-page-headerdefault-parent': 5,
        'parent': 15,
        'grandparent': 10,
        'rawcontent': 1,
        '__trendingHour': 5,
        '__trendingRatingA': 20,
        '__trendingRatingB': 2,
        '__trendingRatingC': 1


    };

    var search = new $hybridsearchObject(hybridsearch);
    search.setPropertiesBoost(boost).setNodeTypeLabels(labels).setQuery('siteSearch', $rootScope).$watch(function (data) {

        $scope.lastActiveTabName = $("#search .phlu-corporate-tags-menu ul.nav-pills > li a.active").length ? $("#search .phlu-corporate-tags-menu ul.nav-pills > li a.active").attr('href').substr(1) : 'alle';
        $scope.result = data;

        setTimeout(function () {


            $scope.$apply(function () {

                if ($("#search .phlu-corporate-tags-menu ul.nav-pills > li a[href='#" + $scope.lastActiveTabName + "']").length === 0) {
                    $scope.lastActiveTabName = 'alle';
                }

                // var activeTab = $("#search .phlu-corporate-tags-menu ul.nav-pills > li a[href='" + lastActiveTab.attr('href') + "']");
                // if (activeTab.length) {
                //     console.log(activeTab);
                //
                //     setTimeout(function () {
                //         activeTab.tab('show');
                //     }, 100);
                // } else {
                //     $("#search .phlu-corporate-tags-menu ul.nav-pills > li:first-child a").tab('show')
                // }

            });


        }, 10);


    });


    $scope.stopSearch = function () {
        $scope.siteSearchLastQuery = $scope.siteSearch;
        $rootScope.siteSearch = '';
        $scope.results = [];
        wasClosed = true;
        $scope.isSearch = false;
    };

    $scope.startSearch = function () {
        if (wasClosed) {
            wasClosed = false;
            $scope.siteSearch = $scope.siteSearchLastQuery;
        }
        $scope.isSearch = true;
    };

    $rootScope.$watch('siteSearch', function (i) {
        $scope.siteSearch = i;
        if (i === '' && wasClosed == false) {
            $scope.siteSearchLastQuery = '';
            $scope.isSearch = false;
            $(".sidebar").removeClass('siteSearchActive');
            $("body").removeClass('siteSearchActive');
        } else {
            $(".sidebar").addClass('siteSearchActive');
            $("body").addClass('siteSearchActive');
            search.run();
        }
    });


}]);


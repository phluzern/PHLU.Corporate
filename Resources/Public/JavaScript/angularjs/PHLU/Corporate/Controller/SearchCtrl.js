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

                if ($scope.node.isTurboNode()) {
                    return template + 'turbonode.html';
                } else {

                    switch ($scope.node.getNodeType()) {
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

PHLUCorporateApp.controller('SearchCtrl', ['$scope', '$sce', '$hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, $sce, $hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    var hybridsearch = new $hybridsearch(
        'https://phlu-neos.firebaseio.com',
        'live',
        'fb11fdde869d0a8fcfe00a2fd35c031d'
    );

    $scope.result = new $hybridsearchResultsObject();

    $scope.siteSearch = '';
    $scope.siteSearchLastQuery = '';
    $scope.siteSearchPath = '';
    $scope.siteSearchPathName = '';
    $scope.isSearch = false;

    var wasClosed = false;
    var sideBarNav = $(".nav.sidebar-nav:first-child");
    var sideBarNavCurrent = sideBarNav.find("li.current,li.active");
    var sideBarNavCurrentClasses = sideBarNavCurrent.attr('class') !== undefined ? sideBarNavCurrent.attr('class') : 'current';

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

    var boost = {

        'phlu-corporate-content-page-headerdefault-grandparent': 50,
        'phlu-corporate-contact-grandparent': 10,
        'phlu-corporate-contact-firstname': 10,
        'phlu-corporate-contact-lastname': 10,
        'phlu-corporate-contact-phone': 10,
        'phlu-corporate-contact-email': 10,
        'phlu-corporate-headline-title': 10,
        'phlu-corporate-content-page-headerdefault-parent': 5,
        'parent': 15,
        'grandparent': 10,
        'rawcontent': 1

    };


    var tabs = $("#searchResultsTabs");
    search.setPropertiesBoost(boost).setNodePath("siteSearchPath", $scope).setNodeTypeLabels(labels).setQuery('siteSearch', $scope).$watch(function (data) {

        $scope.$apply(function () {
            $scope.result = data;
            $scope.grouped = data.getGrouped();
        });



        if (tabs.find("a.active").length === 0) {
            tabs.find("a:first-child").trigger("click");
        }


    });


    $scope.stopSearch = function () {
        $scope.siteSearchLastQuery = $scope.siteSearch;
        $scope.siteSearch = '';
        $scope.results = [];
        wasClosed = true;
        $scope.isSearch = false;
        sideBarNavCurrent.addClass(sideBarNavCurrentClasses);
    };

    $scope.startSearch = function () {
        if (wasClosed) {
            wasClosed = false;
            $scope.siteSearch = $scope.siteSearchLastQuery;
        }
        $scope.isSearch = true;
    };

    $scope.$watch('siteSearch', function (i) {
        if (i === '' && wasClosed == false) {
            $scope.siteSearchLastQuery = '';
            $scope.isSearch = false;
        }
    });

    $scope.$watch('siteSearch', function (i) {

        if (i != '') {
            sideBarNavCurrent.removeClass(sideBarNavCurrentClasses);
        } else {
            sideBarNav.find("li").removeClass(sideBarNavCurrentClasses);
            sideBarNavCurrent.addClass(sideBarNavCurrentClasses);
        }

    });


    sideBarNav.find("li").click(function (event) {

        if ($scope.isSearch) {

            event.preventDefault();


            if ($(this).hasClass(sideBarNavCurrentClasses)) {
                var wascurrent = true;
            } else {
                var wascurrent = false;
            }


            sideBarNav.find("li").removeClass(sideBarNavCurrentClasses);
            if (wascurrent === false) $(this).addClass(sideBarNavCurrentClasses);


            setTimeout(function () {
                $scope.$apply(function () {
                    if (wascurrent) {
                        $scope.siteSearchPath = '';
                        $scope.siteSearchPathName = '';
                    } else {
                        $scope.siteSearchPathName = "'" + $(event.target).text() + "'";
                        $scope.siteSearchPath = $(event.target).attr('href').substring(0, $(event.target).attr('href').length - 5);
                    }
                });
            }, 10);


        }

    });


}]);


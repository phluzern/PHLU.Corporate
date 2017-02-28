// Phlu.Corporate:Page.View.Default filter tag navigation


PhluCorporateApp.directive('search', function ($sce) {


    var template = '/_Resources/Static/Packages/Phlu.Corporate/JavaScript/angularjs/Phlu/Corporate/Templates/Search/';

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

                        case 'phlu-corporate-event':

                            if ($scope.view === 'all') {
                                return template + '/All/default.html';
                            } else {
                                return template + '/Group/phlu-corporate-event.html';
                            }

                        case 'phlu-corporate-newsitem':

                            if ($scope.view === 'all') {
                                return template + '/All/default.html';
                            } else {
                                return template + '/Group/phlu-corporate-news.html';
                            }

                        case 'phlu-corporate-content-page-headerdefault':

                            return template + '/All/phlu-corporate-content-page-headerdefault.html';


                        case 'phlu-qmpilot-nodetypes-file':

                            if ($scope.view === 'all') {
                                return template + '/All/phlu-qmpilot-nodetypes-file.html';
                            } else {
                                return template + '/Group/phlu-qmpilot-nodetypes-file.html';
                            }

                        case 'phlu-neos-nodetypes-course-study-furthereducation':
                        case 'phlu-neos-nodetypes-course-module-furthereducation':

                            if ($scope.view === 'all') {
                                return template + '/All/phlu-neos-nodetypes-course-study-furthereducation.html';
                            } else {
                                return template + '/Group/phlu-neos-nodetypes-course-study-furthereducation.html';
                            }

                        case 'phlu-neos-nodetypes-project':


                            return template + '/All/phlu-neos-nodetypes-project.html';

                        case 'zebis':

                            return template + '/Group/zebis.html';

                        case 'blog':

                            return template + '/Group/blog.html';

                        case 'phlu-neos-nodetypes-publication':

                            if ($scope.view === 'all') {
                                return template + '/All/phlu-neos-nodetypes-publication.html';
                            } else {
                                return template + '/Group/phlu-neos-nodetypes-publication.html';
                            }


                        default:
                            return template + '/All/default.html';
                    }
                }


            };

        }
    };


});

PhluCorporateApp.filter('orderObjectBy', function () {
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


PhluCorporateApp.directive('nodeType', function ($sce) {

    var labels = {};


    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.text(labels[attrs.name] !== undefined ? labels[attrs.name] : attrs.name);

        }
    };


});


PhluCorporateApp.controller('SearchCtrl', ['$scope', '$rootScope', '$sce', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$compile', function ($scope, $rootScope, $sce, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $compile) {


    $scope.result = new $hybridsearchResultsObject();

    $rootScope.siteSearch = '';
    if ($rootScope.siteSearchTabs === undefined) {
        $rootScope.siteSearchTabs = {};
    }
    $scope.limit = {};
    $scope.siteSearch = '';
    $scope.siteSearchLastQuery = '';
    $scope.siteSearchPath = '';
    $scope.siteSearchPathName = '';
    $scope.isSearch = false;
    $scope.lastActiveTabName = 'alle';
    $scope.lastActiveTabVisited = {'alle': true};

    var wasClosed = false;


    var labels = {

        'phlu-corporate-contact': 'Kontakte',
        'phlu-corporate-headline': 'Seiten',
        'phlu-corporate-page-overview-onepage': 'Seiten',
        'phlu-corporate-page-section': 'Seiten',
        'phlu-corporate-text': 'Seiten',
        'phlu-corporate-textplain': 'Seiten',
        'phlu-corporate-section': 'Seiten',
        'phlu-corporate-tags-menu': 'Seiten',
        'phlu-neos-nodetypes-contentcollection-table-body': 'Seiten',
        'phlu-corporate-table': 'Seiten',
        'phlu-corporate-content-page-headerdefault': 'Seiten',
        'phlu-qmpilot-nodetypes-file': 'Dateien',
        'phlu-corporate-image': 'Bilder',
        'phlu-neos-nodetypes-project': 'Projekte',
        'phlu-neos-nodetypes-publication': 'Publikationen',
        'phlu-corporate-location': 'Standorte',
        'phlu-corporate-event': 'Veranstaltungen',
        'phlu-corporate-newsitem': 'News',
        'phlu-neos-nodetypes-course-study-furthereducation': 'Weiterbildungsstudiengänge',
        'phlu-neos-nodetypes-course-module-furthereducation': 'Weiterbildungsskurse',
        'zebis': 'Unterrichtsmaterial',
        'blog': 'Blog',
        '*': 'Seiten'

    };

    var boost = {

        'phlu-corporate-contact-text': 150,
        'phlu-corporate-contact-education': -1, // dont'search here
        'phlu-corporate-contact-activities': -1, // dont'search here
        'phlu-corporate-contact-function': 10,
        'phlu-corporate-contact-functions': -1,
        'phlu-corporate-contact-consulting': -1, // dont'search here
        'phlu-corporate-contact-expertise': -1, // dont'search here
        'phlu-corporate-contact-functioncustom': -1, // dont'search here
        'phlu-corporate-contactsgroup.phlu-corporate-contact-firstname': 60,
        'phlu-corporate-contactsgroup.phlu-corporate-contact-lastname': 60,
        'phlu-corporate-contact-phone': 15000


    };

    var boostParentNodeType = {
        'Phlu.Neos.NodeTypes:ContentCollection.ContactsGroup': 1.2,
        'Phlu.Neos.NodeTypes:ContentCollection.Contacts': 1.8,
        'Phlu.Corporate:ContentCollection.Page.View.Default': 1.5
    };

    var groupedBy = {

        'Kontakte': ['email', 'phone'],
        'Standorte': ['lng', 'lat'],
        'Projekte': 'title',
        'Seiten': 'breadcrumb'


    };

    var orderBy = {
        'Projekte': 'title',
        'Publikationen': 'citationstyle'
    };


    var search = new $hybridsearchObject(hybridsearch);

    var external =
        [
            // {
            //     http: "/proxy?url=https://www.zebis.ch/suche/$query/bundle/teachingmaterial",
            //     parser: {
            //         type: 'html',
            //         config: {
            //             'nodeType': 'zebis',
            //             'results': {'selector': '.search-results.apachesolr_search-results > .node'},
            //             'fields': {
            //                 'title': {'selector': '> div:first-child h2 > a'},
            //                 'rawcontent': {'selector': '> div:nth-child(2)'},
            //                 'url': {
            //                     'selector': 'a',
            //                     'attribute': 'href',
            //                     'prepend': 'https://www.zebis.ch'
            //                 }
            //             }
            //         }
            //     }
            // },
            {
                http: "http://d4jj42ydaxxx2.cloudfront.net/weiterbildung/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'rawcontent': 'description',
                            'url': 'link'
                        }
                    }
                }
            }
        ];


    var searchResultApplyTimer = null;

    search.addPropertyFilter('lastname', '', null, true, false, 'phlu-corporate-contact');
    search.setExternalSources(external);

    search.setGroupedBy(groupedBy).setOrderBy(orderBy).setParentNodeTypeBoostFactor(boostParentNodeType).setPropertiesBoost(boost).setNodeTypeLabels(labels).setQuery('siteSearch', $rootScope).$bind('result', $scope).$watch(function (data) {

        if (searchResultApplyTimer) {
            window.clearTimeout(searchResultApplyTimer);
        }
        searchResultApplyTimer = setTimeout(function () {


            $scope.$apply(function () {

                angular.forEach($rootScope.siteSearchTabs, function (group, id) {
                    $rootScope.siteSearchTabs[id] = false;
                });
                angular.forEach(data.getGrouped().getItems(), function (group) {
                    $rootScope.siteSearchTabs[group.label] = true;
                });

                var i = 'alle';
                angular.forEach($rootScope.siteSearchTabs, function (value, group) {
                    if (value && group !== 'alle') {
                        i = group;
                    }
                });

                if ($rootScope.siteSearchTabs[$rootScope.lastActiveTabName] === false) {
                    $("#search .phlu-corporate-tags-menu ul.nav-pills > li a").removeClass('active');
                    $("#search .phlu-corporate-tags-menu ul.nav-pills > li a[href='#" + i + "']").addClass('active');
                    if ($rootScope.lastActiveTabVisited === undefined) {
                        $rootScope.lastActiveTabVisited = {};
                    }
                    $scope.setLastActiveTabname(i);

                }


            });


        }, 60);


    });


    $scope.setLastActiveTabname = function (name) {

        if (name === undefined) {
            if ($("#search .phlu-corporate-tags-menu ul.nav-pills > li a[href='#" + $rootScope.lastActiveTabName + "']").length === 0) {
                $rootScope.lastActiveTabName = $("#search .phlu-corporate-tags-menu ul.nav-pills > li a.active").length ? $("#search .phlu-corporate-tags-menu ul.nav-pills > li a.active").attr('href').substr(1) : 'alle';
            }
        } else {
            $rootScope.lastActiveTabName = name;
        }

    }

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

    $scope.setNodeTypeProperties = function (nodeTypeProperties) {
        search.setNodeTypeProperties(nodeTypeProperties);
    };


    $rootScope.$watch('lastActiveTabName', function (i) {

        if ($scope.lastActiveTabName !== undefined && i !== undefined) {
            $scope.lastActiveTabName = $rootScope.lastActiveTabName;
            $scope.lastActiveTabVisited = $rootScope.lastActiveTabVisited;
        }


        //$compile(element.html(o.html()))(scope);

        // $("#"+i).html(element);

        //  $compile(o.html())($scope);


    });

    $rootScope.$watch('siteSearch', function (i) {
        $scope.siteSearch = i;
        if (i === '' && wasClosed == false) {
            $scope.siteSearchLastQuery = '';
            $scope.isSearch = false;
            $(".sidebar").removeClass('siteSearchActive');
            $("body").removeClass('siteSearchActive');
            $("#search div").addClass('noSearchResults');
        } else {
            if (wasClosed) {
                $("body").removeClass('siteSearchActive');
                wasClosed = false;
            }
            else {
                $(".sidebar").addClass('siteSearchActive');
                $("body").addClass('siteSearchActive');
                $("#search div").removeClass('noSearchResults');
                search.run();
            }

        }
    });


}]);


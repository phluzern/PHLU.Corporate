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
                        case 'phlu-neos-nodetypes-course-event-furthereducation':

                            if ($scope.view === 'all') {
                                return template + '/All/phlu-neos-nodetypes-course-study-furthereducation.html';
                            } else {
                                return template + '/Group/phlu-neos-nodetypes-course-study-furthereducation.html';
                            }

                        case 'phlu-neos-nodetypes-project':


                            return template + '/All/phlu-neos-nodetypes-project.html';

                        case 'bibliothek':

                            return template + '/Group/bibliothek.html';

                        case 'blog':

                            if ($scope.view === 'all') {
                                return template + '/All/blog.html';
                            } else {
                                return template + '/Group/blog.html';
                            }


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


PhluCorporateApp.directive('quicknode', function ($sce) {


    var template = '/_Resources/Static/Packages/Phlu.Corporate/JavaScript/angularjs/Phlu/Corporate/Templates/Search/Quicknode/';

    return {
        template: '<ng-include src="getTemplateUrl()"/>',
        scope: {
            node: '=data'
        },
        restrict: 'E',
        controller: function ($scope) {

            $scope.getTemplateUrl = function () {

                if ($scope.node === undefined) {
                    return '';
                }

                var isnumeric = $scope.$root.siteSearch.match(/\d/g) == null ? false : true;

                switch ($scope.node.getNodeType()) {

                    case 'phlu-corporate-contact':

                        if (isnumeric) {
                            return template + 'phlu-corporate-contact-name.html';
                        } else {
                            return template + 'phlu-corporate-contact.html';
                        }


                        break;

                    case 'phlu-neos-nodetypes-course-study-furthereducation':
                    case 'phlu-neos-nodetypes-course-module-furthereducation':
                    case 'phlu-neos-nodetypes-course-event-furthereducation':

                        if (isnumeric) {
                            return template + 'phlu-neos-nodetypes-course-study-furthereducation-title.html';
                        } else {
                            return template + 'phlu-neos-nodetypes-course-study-furthereducation.html';
                        }
                        break;

                    default:
                        return template + 'default.html';
                }


            };

        }
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


PhluCorporateApp.controller('SearchMobileCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.siteSearchSearchMobile = '';

    $scope.siteSearchMobileSubmit = function() {
        $rootScope.siteSearch = $scope.siteSearchSearchMobile;

        jQuery("#siteSearchSearchMobile").blur();

        window.setTimeout(function () {
                jQuery('html, body').stop().animate({
                    'scrollTop': 0
                }, 100, 'swing', function () {

                });
        }, 5);

        return false;
    }



}]);


PhluCorporateApp.controller('SearchCtrl', ['$scope', '$rootScope', '$sce', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$compile', '$document', function ($scope, $rootScope, $sce, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $compile, $document) {


    $scope.result = new $hybridsearchResultsObject();

    $rootScope.siteSearch = '';
    $rootScope.quickNode = null;

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
    var isBackend = jQuery("body").hasClass("neos-backend");

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
        'phlu-corporate-page-furthereducation-detail-study': 'Weiterbildungsstudiengänge',
        'phlu-corporate-page-furthereducation-detail-module': 'Weiterbildungsskurse',
        'phlu-neos-nodetypes-course-module-furthereducation': 'Weiterbildungsskurse',
        'phlu-neos-nodetypes-course-event-furthereducation': 'Weiterbildungsveranstaltungen',
        'phlu-corporate-page-furthereducation-detail-event': 'Weiterbildungsveranstaltungen',
        'zebis': 'Unterrichtsmaterial',
        'blog': 'Blog',
        'wiki': 'Wiki',
        'bibliothek': 'Bibliothek',
        '*': 'Seiten'

    };

    var boost = {

        'phlu-corporate-contact-text': 150,
        'phlu-corporate-contact-education': -1, // dont'search here
        'phlu-corporate-contact-activities': -1, // dont'search here
        'phlu-corporate-contact-functions': -1,
        'phlu-corporate-contact-consulting': -1, // dont'search here
        'phlu-corporate-contact-expertise': -1, // dont'search here
        'phlu-corporate-contact-function': 50, // dont'search here
        'phlu-corporate-contact-phone': 15000,
        'phlu-neos-nodetypes-course-module-furthereducation-title': 50,
        'phlu-neos-nodetypes-course-study-furthereducation-title': 100,
        'phlu-neos-nodetypes-course-event-furthereducation-title': 50,
        'phlu-neos-nodetypes-course-module-furthereducation-genre': 1,
        'phlu-neos-nodetypes-course-study-furthereducation-genre': 1,
        'phlu-neos-nodetypes-course-module-furthereducation-nr': 200,
        'phlu-neos-nodetypes-course-study-furthereducation-nr': 200,
        'phlu-neos-nodetypes-course-event-furthereducation-nr': 200,
        'phlu-corporate-textplain-grandparent': 100,
        'phlu-neos-nodetypes-publication-date': -1,
        'phlu-neos-nodetypes-publication-grandparent': -1,
        'phlu-neos-nodetypes-publication-id': -1,
        'phlu-neos-nodetypes-publication-language': -1,
        'phlu-neos-nodetypes-publication-publicationtype': -1,
        'phlu-neos-nodetypes-publication-organisations': -1,
        'phlu-neos-nodetypes-publication-persons': -1,
        'phlu-neos-nodetypes-publication-title': -1,
        'phlu-neos-nodetypes-publication-url': -1,
        'phlu-neos-nodetypes-publication-sortingkey': -1,
        'url': -1,
        'grandparent': -1


    };

    var boostParentNodeType = {

    };

    var groupedBy = {
        //'Kontakte': [function(node) {return node.getProperty('eventoid') ? node.getProperty('eventoid') : node.getProperty('email');}],
        'Kontakte': ['lastname','firstname'],
        'Standorte': ['lng', 'lat'],
        'Projekte': 'title',
        'Seiten': ['url', 'documentNode.title'],
        'Weiterbildungsstudiengänge': 'url',
        'Weiterbildungsskurse': 'url',
        'Weiterbildungsveranstaltungen': 'url'
    };

    var orderBy = {
        'Projekte': 'title',
        'phlu-neos-nodetypes-publication': function(node) {return (10000-parseInt(node.properties['phlu-neos-nodetypes-publication-sortingkey'].substr(0,4)));}
    };


    var search = new $hybridsearchObject(hybridsearch);

    var external =
        [
            {
                http: "http://blog.phlu.ch/weiterbildung/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'description': 'description',
                            'url': 'link',
                            'content': 'encoded'
                        }
                    }
                }
            },
            {
                http: "http://blog.phlu.ch/hd-blog/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'description': 'description',
                            'url': 'link',
                            'content': 'encoded'
                        }
                    }
                }
            }
            ,
            {
                http: "http://blog.phlu.ch/weiter/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'description': 'description',
                            'url': 'link',
                            'content': 'encoded'
                        }
                    }
                }
            }
            ,
            {
                http: "http://blog.phlu.ch/mathe-blog/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'description': 'description',
                            'url': 'link',
                            'content': 'encoded'
                        }
                    }
                }
            }
            ,
            {
                http: "http://blog.phlu.ch/businessapplications/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'description': 'description',
                            'url': 'link',
                            'content': 'encoded'
                        }
                    }
                }
            }
            ,
            {
                http: "http://blog.phlu.ch/international/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'description': 'description',
                            'url': 'link',
                            'content': 'encoded'
                        }
                    }
                }
            }
            ,
            {
                http: "http://blog.phlu.ch/eduweb/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'description': 'description',
                            'url': 'link',
                            'content': 'encoded'
                        }
                    }
                }
            }
            ,
            {
                http: "http://blog.phlu.ch/theaterpaedagogik/feed/",
                parser: {
                    type: 'xml',
                    config: {
                        'nodeType': 'blog',
                        'results': {'selector': 'rss.channel.item'},
                        'fields': {
                            'title': 'title',
                            'description': 'description',
                            'url': 'link',
                            'content': 'encoded'
                        }
                    }
                }
            }

            // ,
            // {
            //
            //     http: "/swissbib/$query",
            //     parser: {
            //         type: 'xml',
            //         config: {
            //             'nodeType': 'bibliothek',
            //             'results': {'selector': 'rss.channel.item'},
            //             'fields': {
            //                 'bibliothek-title': 'title',
            //                 'bibliothek-format': 'format',
            //                 'bibliothek-creator': 'creator',
            //                 'url': 'link',
            //                 'bibliothek-pubDate': 'pubDate',
            //                 'bibliothek-author': 'author'
            //             }
            //         }
            //     }
            // }
            //
            // ,
            // {
            //
            //     http: "/iluplus/$query",
            //     parser: {
            //         type: 'json',
            //         config: {
            //             'nodeType': 'bibliothek',
            //             'fields': {
            //                 'bibliothek-title': 'EXLResultTitle',
            //                 'bibliothek-format': 'EXLThumbnailCaption',
            //                 'bibliothek-author': 'EXLResultAuthor',
            //                 'bibliothek-isbn': 'EXLResultFourthLine',
            //                 'bibliothek-details': 'EXLResultDetails',
            //                 'rawcontent': 'rawcontent',
            //                 'url': 'link',
            //                 'image': 'image',
            //             }
            //         }
            //     }
            // }


        ];


    var searchResultApplyTimer = null;
    var lasthash = null;

    //search.disableRealtime();
    search.enableCache();
    search.addPropertyFilter('lastname', '', null, true, false, 'phlu-corporate-contact');
    search.addPropertyFilter('asset.url', '', null, true, false, 'phlu-qmpilot-nodetypes-file');
    //search.setExternalSources(external);

    search.setGroupedBy(groupedBy).setOrderBy(orderBy).setParentNodeTypeBoostFactor(boostParentNodeType).setPropertiesBoost(boost).setNodeTypeLabels(labels).setQuery('siteSearch', $rootScope).$bind('result', $scope).$watch(function (data) {

        if (searchResultApplyTimer) {
            window.clearTimeout(searchResultApplyTimer);
        }

        if (lasthash === null) {
            // watch for escape
            $document.bind('keydown', function (e) {
                if (e.keyCode == 27) {
                    $scope.stopSearch();
                }
            });
        }



        searchResultApplyTimer = setTimeout(function () {
            var lh = data.getHash();

            if (lasthash !== lh) {
                $scope.$apply(function () {

                    $rootScope.quickNode = data.getQuickNodes()[0];

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
            }

            lasthash = lh;

        }, 10);


    });


    if (isBackend) {
        $("#searchInput").keypress(function (e) {
            if (e.which == 13) {
                if ($rootScope.quickNode.getUrl()) {
                    window.history.pushState("", "", $rootScope.quickNode.getUrl());
                    Typo3Neos.Content.reloadPage();

                }
            }
        });

    } else {
        $("#searchInput").keypress(function (e) {
            if (e.which == 13) {
                if ($rootScope.quickNode !== undefined && $rootScope.quickNode.getUrl()) {
                    window.location.href = $rootScope.quickNode.getUrl();
                }
            }
        });
    }


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
        jQuery("#siteSearchSearchMobile").val("");
        window.setTimeout(function () {
            $rootScope.$digest();
            $scope.$digest();
        }, 1);
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


    var isbinded = false;

    $rootScope.$watch('siteSearch', function (i) {

        $scope.siteSearch = i;
        if (i === '' && wasClosed == false) {
            $scope.siteSearchLastQuery = '';
            $scope.isSearch = false;
            $(".sidebar").removeClass('siteSearchActive');
            $("body").removeClass('siteSearchActive');
            $("#search div").addClass('noSearchResults');
            isbinded = false;

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

            isbinded = true;

        }
    });


}]);


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

                        case 'phlu-corporate-text':

                            if ($scope.view === 'all') {
                                return template + '/All/phlu-corporate-text.html';
                            } else {
                                return template + '/Group/phlu-corporate-text.html';
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

                        case 'phlu-corporate-location':

                            if ($scope.view === 'all') {
                                return template + '/All/phlu-corporate-location.html';
                            } else {
                                return template + '/Group/phlu-corporate-location.html';
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
    $scope.autocompleteIsShowing = true;
    $scope.autocomplete = [];
    $scope.autocompleteLastPos = -1;

    var timer = null;
    $scope.$watch('siteSearchSearchMobile', function (query, oldquery) {

        if (timer) {
            window.clearTimeout(timer);
        }

        window.setTimeout(function () {

            $rootScope.siteSearch = $scope.siteSearchSearchMobile;

            if (oldquery !== query && query == '') {
                $scope.autocompleteIsShowing = true;
            }
            if ($rootScope.autocomplete.length > 5) {
                $scope.autocompleteIsShowing = true;
            }

            window.setTimeout(function () {
                $scope.$digest();
                $rootScope.$digest();
            }, 1);

        }, 1);

    });

    // autocomplete
    var keybinded = false;
    $scope.siteSearchMobileBlur = function () {
        window.setTimeout(function () {
            $scope.siteSearchMobileFocus = false;
            $scope.autocompleteIsShowing = false;
            if ($scope.autocompleteLastPos >= 0 && $scope.autocomplete[$scope.autocompleteLastPos] !== undefined) {
                $scope.setSiteSearch($scope.autocomplete[$scope.autocompleteLastPos]);
            }
            window.setTimeout(function () {
                $scope.$digest();
            }, 1);
        }, 1000);
    }
    $scope.siteSearchMobileBlur = function () {
        window.setTimeout(function () {
            $scope.siteSearchMobileFocus = false;
            $scope.autocompleteIsShowing = false;
            if ($scope.autocompleteLastPos >= 0 && $scope.autocomplete[$scope.autocompleteLastPos] !== undefined) {
                $scope.setSiteSearch($scope.autocomplete[$scope.autocompleteLastPos]);
            }
            window.setTimeout(function () {
                $scope.$digest();
            }, 1);
        }, 1000);
    }

    $scope.siteSearchMobileSetFocus = function () {

        if (keybinded == false) {


        }
        keybinded = true;
        window.setTimeout(function () {
            $scope.siteSearchMobileFocus = true;
            window.setTimeout(function () {
                $scope.$digest();
            }, 1);
        }, 10);

    }


    $scope.setSiteSearch = function (query) {

        $scope.siteSearchSearchMobile = query;
        $scope.autocompleteIsShowing = false;
        $rootScope.siteSearch = $scope.siteSearchSearchMobile;

        jQuery("#siteSearchSearchMobile").blur();

        window.setTimeout(function () {
            jQuery('html, body').stop().animate({
                'scrollTop': 0
            }, 100, 'swing', function () {

            });
        }, 5);

    }

    $scope.siteSearchMobileSubmit = function () {
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

    $scope.siteSearchMobileClose = function () {
        $scope.siteSearchSearchMobile = '';
        $rootScope.siteSearch = $scope.siteSearchSearchMobile;

        jQuery("#siteSearchSearchMobile").blur();

        window.setTimeout(function () {
            $scope.$digest();
            $rootScope.$digest();
        }, 1);

        return false;
    }

    $scope.getAutocompleteMobile = function () {
        return $rootScope.autocomplete;
    }


}]);


PhluCorporateApp.controller('SearchCtrl', ['$scope', '$rootScope', '$sce', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$compile', '$document', function ($scope, $rootScope, $sce, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $compile, $document) {


    $scope.result = new $hybridsearchResultsObject();
    $rootScope.autocomplete = [];
    $rootScope.autocompleteLastPos = -1;

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

    $rootScope.setSiteSearch = function (query) {
        $rootScope.siteSearch = query;
        window.setTimeout(function () {
            $rootScope.$digest();
            $rootScope.siteSearchTopFocus = false;
        }, 1);
    }

    $rootScope.setSiteSearchPreview = function (query, position) {
            search.$$app.search(null, null, query);
            $rootScope.autocompleteLastPos = position;
            window.setTimeout(function () {
                $rootScope.$digest();
            }, 1);
    }


    // autocomplete
    var keybinded = false;
    $rootScope.siteSearchTopBlur = function () {

        $rootScope.autocompleteLastPos = -1;

        window.setTimeout(function () {
            $rootScope.$digest();
            window.setTimeout(function () {
                $rootScope.siteSearchTopFocus = false;
                window.setTimeout(function () {
                    $rootScope.$digest();
                }, 100);
            }, 100);
        }, 1);

    }

    $rootScope.siteSearchTopBlurAutocomplete = function () {
        $rootScope.autocompleteLastPos = -1;
        search.$$app.search(null, null, $rootScope.siteSearch);
        window.setTimeout(function () {
            $rootScope.$digest();
        }, 1);
    }

    $rootScope.siteSearchTopSetFocus = function () {

        if (keybinded == false) {


            jQuery(document).mousedown(function (e) {

                if (jQuery(e.target).attr('href') && jQuery(e.target).attr('href').indexOf(window.location.href) == 0) {
                    location.reload();
                    e.preventDefault();
                    return false;

                }

            });


            jQuery(document).keydown(function (e) {
                if (jQuery(e.target).attr('id') == 'searchInput') {

                    switch (e.which) {

                        case 13: // enter
                            if ($rootScope.autocompleteLastPos >= 0 && $rootScope.autocomplete[$rootScope.autocompleteLastPos] !== undefined) {
                                $rootScope.siteSearch = $rootScope.autocomplete[$rootScope.autocompleteLastPos];
                            }
                            jQuery("#searchInput").blur();
                            break;

                        case 38: // up
                            $rootScope.autocompleteLastPos--;
                            var el = document.getElementById("searchInput");
                            if (el) {
                                window.setTimeout(function () {
                                    if (typeof el.selectionStart == "number") {
                                        el.selectionStart = el.selectionEnd = el.value.length;
                                    } else if (typeof el.createTextRange != "undefined") {
                                        el.focus();
                                        var range = el.createTextRange();
                                        range.collapse(false);
                                        range.select();
                                    }
                                }, 1);
                            }
                            break;

                        case 40: // down
                            $rootScope.autocompleteLastPos = $rootScope.autocompleteLastPos + 1;
                            break;

                        default:
                            return; // exit this handler for other keys
                    }


                    if ($rootScope.autocompleteLastPos < 0) {
                        $rootScope.autocompleteLastPos = -1;
                    }
                    if ($rootScope.autocompleteLastPos >= $rootScope.autocomplete.length) {
                        $rootScope.autocompleteLastPos = $rootScope.autocomplete.length - 1;
                    }

                    if ($rootScope.autocompleteLastPos >= 8) {
                        $rootScope.autocompleteLastPos = 7;
                    }

                    search.$$app.search(null, null, $rootScope.autocomplete[$rootScope.autocompleteLastPos]);

                    window.setTimeout(function () {
                        $rootScope.$digest();
                    }, 1);

                }
            });
        }
        keybinded = true;

        window.setTimeout(function () {
            $rootScope.siteSearchTopFocus = true;
            window.setTimeout(function () {
                $rootScope.$digest();
            }, 1);
        }, 10);
    }


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
        'phlu-neos-nodetypes-course-module-furthereducation': 'Weiterbildungsskurse',
        'phlu-neos-nodetypes-course-event-furthereducation': 'Weiterbildungsveranstaltungen',
        'zebis': 'Unterrichtsmaterial',
        'blog': 'Blog',
        'wiki': 'Wiki',
        'bibliothek': 'Bibliothek',
        '*': 'Seiten'

    };

    var boost = {



        'phlu-corporate-contact-phone': 1000,
        'phlu-corporate-contact-label': -1,
        'phlu-corporate-contact-parent': -1, // dont'search here
        'phlu-corporate-contact-grandparent': -1, // dont'search here
        'phlu-corporate-contact-education': -1, // dont'search here
        'phlu-corporate-contact-activities': -1, // dont'search here
        'phlu-corporate-contact-functions': -1,
        'phlu-corporate-contact-consulting': -1, // dont'search here
        'phlu-corporate-contact-expertise': -1, // dont'search here
        'phlu-corporate-contact-function': 1, // dont'search here
        'phlu-corporate-contact-functioncustom': 1, // dont'search here

        'phlu-neos-nodetypes-project-participants': 100,

        'phlu-corporate-textplain-grandparent': -1,
        'phlu-corporate-textplain-label': -1,
        'phlu-corporate-textplain-parent': -1,

        'phlu-corporate-text-grandparent': -1,
        'phlu-corporate-text-label': -1,
        'phlu-corporate-text-parent': -1,


        'phlu-neos-nodetypes-course-module-furthereducation-nr': 200,
        'phlu-neos-nodetypes-course-study-furthereducation-nr': 200,
        'phlu-neos-nodetypes-course-event-furthereducation-nr': 200,

        'phlu-neos-nodetypes-course-module-furthereducation-title': 20,
        'phlu-neos-nodetypes-course-study-furthereducation-title': 20,
        'phlu-neos-nodetypes-course-event-furthereducation-title': 20,


        'phlu-qmpilot-nodetypes-file-asset': -1,
        'phlu-qmpilot-nodetypes-file-grandparent': -1,
        'phlu-qmpilot-nodetypes-file-parent': 1,
        'phlu-qmpilot-nodetypes-file-label': -1,
        'phlu-qmpilot-nodetypes-file-title': 1,


        'phlu-corporate-location-name': 20000,
        'phlu-corporate-location-street': 20000,
        'phlu-corporate-location-phone': 20000,

        'url': -1,
        'label': 1,
        'parent': 1,
        'grandparent': -1



    };


    var boostParentNodeType = {
        'Phlu.Corporate:Content.Page.HeaderDefault': 5
    };

    var NodeUrlBoostFactor = {
        '/studium/': 7,
        '/weiterbildung/': 1,
        '/beratungen-angebote/': 3,
        '/forschung/': 2,
        '/faecher-und-schwerpunkte/': 5,
        '/ueber-uns/organisation-personen/weiterbildung': 0.001,
        '/ueber-uns/': 0.5

    };

    var groupedBy = {
        //'Kontakte': [function(node) {return node.getProperty('eventoid') ? node.getProperty('eventoid') : node.getProperty('email');}],
        'Kontakte': ['lastname', 'firstname'],
        'Seiten': ['url'],
        'Standorte': ['lng', 'lat'],
        'Weiterbildungsstudiengänge': ['nr'],
        'Weiterbildungsskurse': ['nr'],
        'Weiterbildungsveranstaltungen': ['nr']
    };

    var orderBy = {
        'Projekte': 'title',
        'phlu-neos-nodetypes-publication': function (node) {
            return (10000 - parseInt(node.properties['phlu-neos-nodetypes-publication-sortingkey'].substr(0, 4)));
        }
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
                            'content': 'encoded',
                            'creator': 'creator',
                            'pubDate': 'pubDate',
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
    search.addPropertyFilter('asset.extension', '', null, true, false, 'phlu-qmpilot-nodetypes-file');
    search.addPropertyFilter('street', '', null, true, false, 'phlu-corporate-location');
    search.setExternalSources(external);

    search.setGroupedBy(groupedBy).setNodeUrlBoostFactor(NodeUrlBoostFactor).setOrderBy(orderBy).setParentNodeTypeBoostFactor(boostParentNodeType).setPropertiesBoost(boost).setNodeTypeLabels(labels).setQuery('siteSearch', $rootScope).$bind('result', $scope).$watch(function (data) {

        $rootScope.autocomplete = data.getAutocomplete();
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


        //console.log(data.getDistinct('url'));
        //console.log(data.getGroupedNodes(true));

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


    $scope.$watch('result.getAutocomplete()', function (i) {

        // jQuery("#siteSearchAutocomplete").css('zIndex',9).css('width',jQuery("#searchInput").innerWidth()+4);
        $rootScope.autocomplete = i;
        window.setTimeout(function () {
            $rootScope.$digest();
        }, 1);
    });

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


    var filterAllNodesByNodeType = {
        'phlu-neos-nodetypes-course-study-furthereducation': true,
        'phlu-neos-nodetypes-course-module-furthereducation': true,
        'phlu-neos-nodetypes-course-event-furthereducation': true,
        'phlu-corporate-location': true
    };


    $scope.filterAllResults = function(node) {

        if (filterAllNodesByNodeType[node.nodeType] !== undefined) {
            return false;
        }

        if (node.isTurboNode()) {
            return false;
        }

        return true;

    }



    /**
     * clone from evento controller
     */
    $scope.currentYears = {};
    $scope.isopen = 0;

    /**
     * @public
     * if detail is open
     * @returns void
     */
    $scope.isOpen = function (node) {
        return $scope.isopen === node.identifier;
    };

    /**
     * @public
     * Set node type filter
     * @returns void
     */
    $scope.changeBookable = function (category) {
        $scope.setFilter([-1], 'bookable', category);
    };

    /**
     * @public
     * set current year of given node
     * @param node node
     * @param array year
     * @returns void
     */
    $scope.setCurrentYear = function (node, year) {

        if (year === undefined && $scope.currentYears[node.identifier] == undefined) {
            year = node.getProperty('years.0');
        }

        if (year !== undefined) {
            node.currentyear = year;
            $scope.currentYears[node.identifier] = year;
        }

        if ($scope.currentYears[node.identifier] !== undefined && year !== undefined && year.Id !== undefined) {
            $scope.currentYears[node.identifier].url = node.getUrl().substr(0, node.getUrl().lastIndexOf("/")) + "/" + node.getProperty('id') + "/" + year.Id + node.getUrl().substr(node.getUrl().lastIndexOf("/"));
        }

    };


    /**
     * @public
     * set detail is open
     * @returns void
     */
    $scope.setOpen = function (node, index, containerId) {

        $scope.isopen = $scope.isopen === node.identifier ? 0 : node.identifier;
        $scope.setCurrentYear(node);

        if (containerId !== undefined) {
            index = containerId + "-" + index;
            window.setTimeout(function() {
                addthis.button("#share-"+index, {}, {});
            },100);
        }

    };


}]);


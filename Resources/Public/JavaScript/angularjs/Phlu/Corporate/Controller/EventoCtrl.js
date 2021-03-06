PhluCorporateApp.controller('EventoCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.limit = 15;
    $scope.limitChunkSize = 15;
    $scope.initialFilters = {};
    $scope.graduation = {};
    $scope.nodetypes = [];
    $scope.searchquery = '';
    $scope.isopen = 0;


    $scope.setQuery = function (value) {
        $scope.list.setQuery(value, $scope);
    };

    $scope.setFiltergraduation = function (f) {
        $scope.initialFilters['graduation'] = true;
        $scope.graduation = f;
    };

    $scope.loadMore = function () {
        $scope.limit = $scope.limit + $scope.limitChunkSize;
    };

    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };

    $scope.clearFilter = function (filtertype) {
        $scope[filtertype] = {};
    };


    $scope.setNodeTypes = function (nodetypes) {
        if (nodetypes == null) {
            nodetypes = ['phlu-neos-nodetypes-course-event-furthereducation', 'phlu-neos-nodetypes-course-study-furthereducation', 'phlu-neos-nodetypes-course-module-furthereducation']
        }
        $scope.nodetypes = nodetypes;
    };

    $scope.list
        .setOrderBy({'phlu-neos-nodetypes-course-study-furthereducation': 'nr'})
        .addPropertyFilter('graduation', 'graduation', $scope)
        .setNodeType('nodetypes', $scope)
        //.addPropertyFilter('title', '', null, true)
        .$bind('result', $scope)
        .run();


}]);

PhluCorporateApp.controller('EventoLastVisitedCtrl', ['$scope', '$window', function ($scope, $window) {

    var getVisitedNodes = function () {

        var visitednodes = [];
        var storage = $window.localStorage['furtherEducationNodesVisited'];
        try {

            angular.forEach(angular.fromJson(storage), function (k, n) {
                visitednodes.push(n);
            });
        } catch (e) {
            // skipp
        }

        return visitednodes;

    };

    $scope.countVisitedNodes = function () {


        return getVisitedNodes().length;
    }


}]);

PhluCorporateApp.controller('EventoFurtherEducationCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$rootScope', '$window', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $rootScope, $window) {

    if (typeof addthis !== 'object') {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", 'https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-593fa48787c8ed42');
        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }


    $scope.list = new $hybridsearchObject(hybridsearch);

    if ($rootScope.isLoadedFirst === undefined) {
        $rootScope.isLoadedFirst = false;
    }

    $scope.autocompleteLastPosition = 0;
    $scope.currentYears = {};
    $scope.isUserChangedNodeType = false;
    $scope.isLoadedFirstProgress = 0;
    $scope.isLoadingFirst = false;
    $scope.isUserExtendedSearch = false;
    $scope.result = new $hybridsearchResultsObject();
    $scope.limit = 5;
    $scope.limitChunkSize = 5;
    $scope.searchquery = '';
    $scope.search = {};
    $scope.tab = {};
    $scope.bookable = {
        'Alle': null,
        'Studiengang': null,
        'Kurs': null
    };
    $scope.requestable = {
        'Alle': null,
        'Studiengang': null,
        'Kurs': null
    };

    $scope.graduation = {};
    $scope.nodetypes = ['phlu-neos-nodetypes-course-study-furthereducation', 'phlu-neos-nodetypes-course-module-furthereducation', 'phlu-neos-nodetypes-course-event-furthereducation'];


    $scope.nodetypesFilter = [
        {id: 'all', label: 'Alle', category: 'Alle'},
        {id: 'phlu-neos-nodetypes-course-study-furthereducation', label: 'Studiengänge', category: 'Studiengang'},
        {id: 'phlu-neos-nodetypes-course-module-furthereducation', label: 'Kurse', category: 'Kurs'},
        {id: 'phlu-neos-nodetypes-course-event-furthereducation', label: 'Veranstaltungen', category: 'Veranstaltung'}
    ];


    $scope.nodetypesFilterCurrentLabel = 'Alle';
    $scope.nodetypesFilterCurrentCategory = 'Alle';
    $scope.filters = {
        'graduation': {
            'property': 'graduation',
            'categories': ['Studiengang']
        },
        'year': {
            'property': 'years.Year',
            'categories': ['Studiengang', 'Kurs', 'Alle']
        },
        'targetgroups': {
            'property': 'targetgroups.Bezeichnung',
            'categories': ['Kurs', 'Alle']
        },
        'genre': {
            'property': jQuery(".sectionAutoGeneratedContentFurtherEducationList").length ? 'genre.Id' : 'genre.Name',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
        },
        'isEmpfohlen': {
            'property': 'isempfohlen',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
        },
        'isLastMinute': {
            'property': 'islastminute',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
        },
        'isNeuste': {
            'property': 'isneuste',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
        },
        'isVisited': {
            'property': 'url',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
        },
        'dayofweek': {
            'property': 'module-furthereducation-start.format.A',
            'categories': ['Kurs'],
        },
        'nr': {
            'property': 'furthereducation-nr',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
            'fulltext': true
        },
        'id': {
            'property': 'furthereducation-id',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
            'fulltext': true
        },
        'leaders': {
            'property': 'furthereducation-leaders.0.Fullname',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
            'fulltext': true
        },
        'bookable': {
            'property': 'years.Bookable.indexOf(true)',
            'categories': ['Kurs', 'Studiengang'],
            'reverse': true
        },
        'requestable': {
            'property': 'isrequestable',
            'categories': ['Kurs']
        }
    };

    var boost = {

        'phlu-neos-nodetypes-course-module-furthereducation-title': 50,
        'phlu-neos-nodetypes-course-study-furthereducation-title': 100,
        'phlu-neos-nodetypes-course-event-furthereducation-title': 50,
        'phlu-neos-nodetypes-course-module-furthereducation-genre': 1,
        'phlu-neos-nodetypes-course-study-furthereducation-genre': 1,
        'phlu-neos-nodetypes-course-module-furthereducation-nr': 200,
        'phlu-neos-nodetypes-course-study-furthereducation-nr': 200,
        'phlu-neos-nodetypes-course-event-furthereducation-nr': 200,
        'phlu-neos-nodetypes-course-module-furthereducation-years': 12,
        'url': -1,
        'grandparent': -1


    };

    var NodeUrlBoostFactor = {
        '/weiterbildung/studiengaenge': {'*': 1500},
        '/weiterbildung/veranstaltungen/einfuhrung-in-den-aufgabenbereich': {'*': 1000}
    };


    $scope.$watch('filters', function (filters) {
        angular.forEach(filters, function (filter) {

            if (filter.selected == undefined) {
                filter.selected = {};
            }
            filter.selectedValues = $scope.getFilterSelectedValue(filter);
        });
    }, true);


    $scope.$watch('nodetypesFilterCurrentCategory', function () {
        angular.forEach($scope.filters, function (filter) {
            filter.selectedValues = $scope.getFilterSelectedValue(filter);
        });
    });


    $scope.isLoadedFirst = function () {
        return $rootScope.isLoadedFirst !== undefined ? $rootScope.isLoadedFirst : false;
    }

    $scope.getProgressValue = function () {

        return $scope.isLoadedFirstProgress <= 100 ? $scope.isLoadedFirstProgress : 100;

    }

    $scope.setUserChangedNodeType = function () {
        $scope.isUserChangedNodeType = true;
    }

    $scope.setUserExtendedSearch = function () {
        $scope.isUserExtendedSearch = true;
    }

    $scope.getVisitedNodes = function () {

        var visitednodes = [];
        var storage = $window.localStorage['furtherEducationNodesVisited'];
        try {

            angular.forEach(angular.fromJson(storage), function (k, n) {
                visitednodes.push(n);
            });
        } catch (e) {
            // skipp
        }

        return visitednodes;

    }

    $scope.setIsLoadedFirst = function () {


        $scope.isLoadingFirst = true;
        window.setTimeout(function () {
            $rootScope.isLoadedFirst = true;
            window.setTimeout(function () {
                $scope.$digest();
            })

        }, 10);


    }

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
     * if detail is open
     * @returns void
     */
    $scope.isOpen = function (node) {
        return $scope.isopen === node.identifier;
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
            window.setTimeout(function () {

                addthis.button("#share-" + index, {}, {});

                var element_position = $("#node-" + index).offset().top;
                var scroll_position = $(window).scrollTop();
                if (scroll_position > element_position) {
                    $('html, body').stop().animate({
                        'scrollTop': element_position - 10
                    }, 100, 'swing', function () {

                    });
                }
            }, 100);

        }

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
     * Set node type filter
     * @returns void
     */
    $scope.changeRequestable = function (category) {
        $scope.setFilter([-1], 'requestable', category);
    };

    /**
     * @public
     * Set node type filter
     * @param filter
     * @param boolean notrigger
     * @returns void
     */
    $scope.setNodetypesFilter = function (filter, notrigger) {

        angular.forEach($scope.nodetypesFilter, function (val, key) {
            val.state = false;
        });

        filter.state = true;


        if (notrigger == undefined) {
            $scope.nodetypesFilterCurrentLabel = filter.label;
            $scope.nodetypesFilterCurrentCategory = filter.category;
        }


        var nodetype = [];
        angular.forEach($scope.nodetypesFilter, function (val, key) {
            if (val.state || filter.id == 'all') {
                if (val.id !== 'all') {
                    nodetype.push(val.id);
                }
            }

        });

        $scope.nodetypes = nodetype;

    };


    /**
     * @public
     * Set node type filter
     * @param array nodeTypes
     * @returns void
     */
    $scope.setNodeTypes = function (nodetypes) {
        if (nodetypes == null || nodetypes.length == 0) {
            nodetypes = ['phlu-neos-nodetypes-course-study-furthereducation', 'phlu-neos-nodetypes-course-event-furthereducation', 'phlu-neos-nodetypes-course-module-furthereducation']
        }
        $scope.nodetypes = nodetypes;
    };

    /**
     * @public
     * Set filter
     * @param values
     * @param filtername
     * @param string category
     * @returns void
     */
    $scope.setFilter = function (values, filtername, category) {


        if (typeof values !== 'object') {
            $scope.toggleFilterSelection({
                id: filtername,
                value: values,
                state: false,
                counter: 0
            }, category === undefined ? 'Alle' : category, filtername);
            return null;
        }


        angular.forEach(values, function (value, counter) {
            $scope.toggleFilterSelection({
                id: value,
                value: value,
                state: false,
                counter: counter
            }, category === undefined ? 'Alle' : category, filtername);

        });


    };


    /**
     * @public
     * Set max results
     * @param integer limit
     * @returns void
     */
    $scope.setMaxItems = function (limit) {

        $scope.list.setLimit(limit);

    };

    /**
     * @public
     * Set order by
     * @param string limit
     * @returns void
     */
    $scope.setOrderBy = function (orderby) {


        if (orderby != 0) {

            $scope.list.setOrderBy({'*': orderby})

        } else {

            var hasManualFilter = false;

            if ($scope.filters.id !== undefined && $scope.filters.id.selected !== undefined) {

                hasManualFilter = true;
                $scope.list.setOrderBy({
                    'phlu-neos-nodetypes-course-study-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-study-furthereducation-id']] !== undefined ? $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-study-furthereducation-id']].counter : 0
                    },
                    'phlu-neos-nodetypes-course-module-furthereducation': function (node) {

                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-module-furthereducation-id']] !== undefined ? $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-module-furthereducation-id']].counter : 0
                    },
                    'phlu-neos-nodetypes-course-event-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-event-furthereducation-id']] !== undefined ? $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-event-furthereducation-id']].counter : 0
                    }
                })

            }

            if ($scope.filters.nr !== undefined && $scope.filters.nr.selected !== undefined) {
                hasManualFilter = true;
                $scope.list.setOrderBy({
                    'phlu-neos-nodetypes-course-study-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-study-furthereducation-nr']] !== undefined ? $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-study-furthereducation-nr']].counter : 0
                    },
                    'phlu-neos-nodetypes-course-module-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-module-furthereducation-nr']] !== undefined ? $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-module-furthereducation-nr']].counter : 0
                    },
                    'phlu-neos-nodetypes-course-event-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-event-furthereducation-nr']] !== undefined ? $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-event-furthereducation-nr']].counter : 0
                    }
                })

            }


            if (hasManualFilter == false) {

                var ordering = {
                    'Certificate of Advanced Studies': 'A',
                    'Diploma of Advanced Studies': 'B',
                    'Master of Advanced Studies': 'C',
                    'Event': 'D',
                    'Module': 'E'
                };

                $scope.list.setOrderBy({
                    'phlu-neos-nodetypes-course-study-furthereducation': function (node) {
                        return ordering[node.properties['phlu-neos-nodetypes-course-study-furthereducation-graduation']] + " " + node.properties['phlu-neos-nodetypes-course-study-furthereducation-title'];
                    },
                    'phlu-neos-nodetypes-course-module-furthereducation': function (node) {
                        return ordering[node.properties['Module']] + " " + node.properties['phlu-neos-nodetypes-course-module-furthereducation-title'];
                    },
                    'phlu-neos-nodetypes-course-event-furthereducation': function (node) {
                        return ordering[node.properties['Event']] + " " + node.properties['phlu-neos-nodetypes-course-event-furthereducation-title'];
                    }
                })

            }


        }


    };


    /**
     * @public
     * reset filter
     * @param array genres
     * @returns void
     */
    $scope.resetFilter = function (category, filtername) {

        if (category === undefined) {
            category = "Alle";
        }

        angular.forEach($scope.filters[filtername]['selected'][category], function (filter) {
            filter.state = false;
        });


    };


    /**
     * @private
     * Get filter from filter object
     * @param filterObject
     * @returns filter
     */
    function getFilterFromFilterObject(filterObject) {

        var filter = null;
        angular.forEach($scope.filters, function (val, key) {
            if (key == filterObject.property || val.property == filterObject.property) {
                val.name = key;
                filter = val;
            }
        });

        return filter;

    }

    /**
     * @private
     * Get filter by name
     * @param filterObject
     * @returns filter
     */
    function getFilterByName(name) {

        var filter = null;
        angular.forEach($scope.filters, function (val, key) {
            if (key == name) {
                filter = val;
            }
        });

        return filter;

    }

    /** @private **/
    $.fn.isOnScreen = function () {

        var win = $(window);

        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

    };

    /**
     * @public
     * Toggle state of given filter
     * @param filterObject
     * @param category
     * @param string filter name
     * @returns filterObject
     */
    $scope.setFilterSelectionValue = function (value, category, filtername) {

        if (category == undefined) {
            category = 'all';
        }


        var filter = getFilterByName(filtername);



        if (filter === null) {
            filter = getFilterFromFilterObject(filterObject);
        }

        if (filter === null) {
            return null;
        }


        if (filter.selected[category] == undefined) {
            filter.selected[category] = {};
        }


        if (filter.selected[category][0] == undefined) {
            filter.selected[category][0] = {};
        }


        if (value == '') {
            filter.selected[category][0].state = false;
        } else {
            filter.selected[category][0].state = true;
            filter.selected[category][0].value = value;
        }


    };


    /**
     * @public
     * Toggle state of given filter
     * @param filterObject
     * @param category
     * @param string filter name
     * @returns filterObject
     */
    $scope.toggleFilterSelection = function (filterObject, category, filtername, event) {


        if (category == undefined) {
            category = 'all';
        }


        var filter = getFilterByName(filtername);

        if (filter === null) {
            filter = getFilterFromFilterObject(filterObject);
        }

        if (filter === null) {
            return null;
        }


        if (filter.selected === undefined) {
            filter.selected = {};
        }
        if (filter.selected[category] === undefined) {
            filter.selected[category] = {};
        }

        if (filter.selected[category][filterObject.id] === undefined) {
            filter.selected[category][filterObject.id] = filterObject;
        }


        filter.selected[category][filterObject.id].state = filter.selected[category][filterObject.id].state ? false : true;


        if (event !== undefined) {
            var jQueryElement = jQuery(angular.element(event.target));
            var jQueryDropdownElementWrapper = jQueryElement.parentsUntil('.dropdown-menu').parent().parent();
            var jQueryDropdownElement = jQueryElement.closest('.dropdown-menu').parent().find('.dropdown-toggle').parent();
            window.setTimeout(function () {
                if (jQueryDropdownElementWrapper.isOnScreen() == false) {
                    $('html, body').stop().animate({
                        'scrollTop': jQueryDropdownElement.offset().top
                    }, 1, 'swing', function () {
                    });
                }
            }, 1);
        }


        return filterObject;


    };


    /**
     * @public
     * Get filters selected preview text
     * @param filter filter
     * @param string category
     * @returns string
     */
    $scope.getFilterSelectedPreview = function (filter, category) {

        if (category == undefined) {
            category = 'all';
        }


        var text = '';

        if (filter.selected[category] === undefined) {
            return text;
        }

        angular.forEach(filter.selected[category], function (selected) {


            if (selected.state) {
                if (text !== '') {
                    text += ", ";
                }
                text += selected.value;
            }
        });

        return text;

    };


    /**
     * @public
     * Get filters selected preview text
     * @param filter filter
     * @param string category
     * @returns string
     */
    $scope.isFilterValueSelected = function (value, filter) {

        return $scope.getFilterSelectedValue(filter).indexOf(value) > -1 ? true : false;

    };


    /**
     * @public
     * Get filters selected preview text
     * @returns array
     */
    $scope.getFilterSelectedValue = function (filter) {

        var value = [];

        angular.forEach(filter.selected[$scope.nodetypesFilterCurrentCategory], function (selected) {
            if (selected.state) {
                value.push(selected.value);
            }
        });


        return value;

    };

    /**
     * @public
     * Reset current filters
     * @returns filters
     */
    $scope.resetFilters = function () {

        angular.forEach($scope.filters, function (filter) {
            filter.selected = {};
        });

        return $scope.filters;

    };

    /**
     * @public
     * Toggle visibility of news
     * @returns filters
     */
    $scope.toggleNews = function () {

        if ($scope.showNews === undefined) {
            $scope.showNews = true;
        }
        $scope.showNews = $scope.showNews ? false : true;

    };

    /**
     * @public
     * Count current filters
     * @param string category
     * @returns integer
     */
    $scope.isShowingResult = function () {


        if ($scope.searchquery !== '') {
            return true;
        }


        if ($scope.countCurrentFilters($scope.nodetypesFilterCurrentCategory) > 0) {
            return true;
        }

        if ($scope.nodetypesFilterCurrentLabel !== 'Alle') {

            return true;
        }

        return false;

    }


    /**
     * @public
     * Count current filters
     * @param string category
     * @param string filtername
     * @returns integer
     */
    $scope.countCurrentFilters = function (category, filtername) {


        var counter = 0;
        angular.forEach($scope.filters, function (f) {
            angular.forEach(f, function (selected) {
                if (typeof selected[category] == 'object') {
                    angular.forEach(selected[category], function (item) {

                        if (filtername !== undefined) {
                            filter = getFilterFromFilterObject(f);
                            if (filter.name == filtername) {
                                if (category == undefined || item.state === true) {
                                    counter++;
                                }
                            }
                        } else {
                            if (category == undefined || item.state === true) {
                                counter++;
                            }
                        }

                    });
                }
            });
        });

        return counter;

    };


    /**
     * @private
     * Load more
     * @returns integer
     */
    $scope.loadMore = function (objId) {

        $scope.limit = $scope.limit + $scope.limitChunkSize;
        window.setTimeout(function () {
            if (jQuery(objId).length) {
                var fixcrumbHeight = jQuery('.fix-crumb').height() ? jQuery('.fix-crumb').height() : 0;
                jQuery('html, body').stop().animate({
                    'scrollTop': jQuery(objId).offset().top - fixcrumbHeight
                }, 900, 'swing', function () {

                });
            }
        }, 10);

    };

    /**
     * @private
     * get size of object helper
     * @returns integer
     */
    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };


    /**
     * @private
     * Initialize hybridsearch list
     */
    $scope.list.setPropertiesBoost(boost);
    $scope.list.setNodeUrlBoostFactor(NodeUrlBoostFactor);

    if (window.location.href.indexOf("weiterbildung.html") == -1) {
        $scope.list.enableCache();
    } else {
        //$scope.list.disableRealtime()
    }


    $scope.list.setQuery('searchquery', $scope)
        .setNodeType('nodetypes', $scope)
        // .setOrderBy({'*': '-id'})
        .addPropertyFilter('detailpage.hidden', 'false')
        .addPropertyFilter('deleted', false)
        .$watch(function (i) {
            if ($rootScope.isLoadedFirst == false && $scope.isLoadingFirst == false) {
                $scope.setIsLoadedFirst();
            }
        })
        .$bind('result', $scope);

    angular.forEach($scope.filters, function (filter, name) {
        if (filter.fulltext !== undefined && filter.fulltext) {
            $scope.list.addPropertyFilter(filter.property, 'filters.' + name + '.selectedValues', $scope, filter.reverse == undefined ? false : filter.reverse, false, false, true);
        } else {
            $scope.list.addPropertyFilter(filter.property, 'filters.' + name + '.selectedValues', $scope, filter.reverse == undefined ? false : filter.reverse);
        }
    });


    $scope.list.connectEventSlot('before_redirect', function (data) {
        ga('send', 'event', {
            'eventCategory': 'Weiterbildung ' + $scope.nodetypesFilterCurrentLabel,
            'eventAction': data.query.length ? data.query : '.',
            'eventLabel': data.node.uriResource === undefined ? data.node.getUrl() : data.node.uriResource.path
        });
    });


    $scope.list.run();

    // autocomplate$
    var keybinded = false;

    $scope.$watch('searchquery', function () {

        if (keybinded == false) {
            jQuery(document).keydown(function (e) {


                if (jQuery(e.target).hasClass('searchQueryInput')) {

                    switch (e.which) {

                        case 13: // enter
                            //$rootScope.siteSearch = $rootScope.autocomplete[$rootScope.autocompleteLastPos];
                            jQuery(e.target).val($scope.result.getAutocomplete()[$scope.autocompleteLastPosition]).blur();
                            break;

                        case 38: // up
                            $scope.autocompleteLastPosition--;
                            var el = document.getElementById(jQuery(e.target).attr('id'));
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
                            $scope.autocompleteLastPosition++;
                            break;

                        default:
                            $scope.autocompleteLastPosition = 0;
                            return; // exit this handler for other keys
                    }


                    if ($scope.autocompleteLastPosition < 0) {
                        $scope.autocompleteLastPosition = 0;
                    }
                    if ($scope.autocompleteLastPosition >= $scope.result.countAutocomplete()) {
                        $scope.autocompleteLastPosition = $scope.result.countAutocomplete() - 1;
                    }

                    window.setTimeout(function () {
                        $scope.$digest();
                    }, 1);
                    //search.$$app.search(null, null, $rootScope.autocomplete[$rootScope.autocompleteLastPos]);

                }
            });
        }
        keybinded = true;

    });


}])
;

PhluCorporateApp.filter('castDate', function () {
    return function (input) {

        if (isNaN(input.substr(0, 1))) {
            return input;
        }

        var date = null;
        try {
            date = new Date();
            date.setTime(Date.parse(input));
        } catch (e) {
            //
            return input;
        }

        return date.toLocaleDateString("de-CH");

    };
});


PhluCorporateApp.filter('previewText', function () {
    return function (input) {

        if (input.length > 255) {
            return (input.substr(0, 255 + input.substr(255).indexOf(".")) + '.').substr(0, 300);

        } else {
            return input;
        }

    };
});



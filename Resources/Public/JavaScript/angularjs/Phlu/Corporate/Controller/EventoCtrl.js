PhluCorporateApp.controller('EventoCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$window', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $window) {

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


    var search = new $hybridsearchObject(hybridsearch);

    if ($rootScope.isLoadedFirst === undefined) {
        $rootScope.isLoadedFirst = false;
    }

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

    $scope.graduation = {};
    $scope.nodetypes = ['phlu-neos-nodetypes-course-study-furthereducation', 'phlu-neos-nodetypes-course-module-furthereducation','phlu-neos-nodetypes-course-event-furthereducation'];

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
            'property': 'isEmpfohlen',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
        },
        'isLastMinute': {
            'property': 'isLastMinute',
            'categories': ['Kurs', 'Studiengang', 'Alle'],
        },
        'isNeuste': {
            'property': 'isNeuste',
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
            'property': 'furthereducation-leaders.Fullname',
            'categories': ['Kurs', 'Studiengang', 'Alle']
        },
        'bookable': {
            'property': 'years.Bookable.indexOf(true)',
            'categories': ['Kurs', 'Studiengang'],
            'reverse': true
        }
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

        }, 200);

        return true;

        var t = 1000 * ($scope.nodetypesFilter.length + 1);

        angular.forEach($scope.nodetypesFilter, function (filter, i) {
            window.setTimeout(function () {

                if ($scope.isShowingResult() == false && $scope.isUserChangedNodeType == false) {
                    $scope.setNodetypesFilter(filter, true);

                    if (i == $scope.nodetypesFilter.length - 1) {
                        $rootScope.isLoadedFirst = true;
                        $scope.setNodetypesFilter($scope.nodetypesFilter[0], true);
                    }

                } else {
                    $rootScope.isLoadedFirst = true;
                    window.setTimeout(function () {
                        $scope.$digest();
                    })
                }

            }, t - (i * 10));

        });


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
        if (nodetypes == null) {
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

        search.setLimit(limit);

    };

    /**
     * @public
     * Set order by
     * @param string limit
     * @returns void
     */
    $scope.setOrderBy = function (orderby) {



        if (orderby != 0) {
            search.setOrderBy({'*': orderby})
        } else {

            if ($scope.filters.id !== undefined) {

                search.setOrderBy({
                    'phlu-neos-nodetypes-course-study-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-study-furthereducation-id']].counter
                    },
                    'phlu-neos-nodetypes-course-module-furthereducation': function (node) {

                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-module-furthereducation-id']].counter
                    },
                    'phlu-neos-nodetypes-course-event-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.id.selected.Alle[node.properties['phlu-neos-nodetypes-course-event-furthereducation-id']].counter
                    }
                })

            }

            if ($scope.filters.nr !== undefined) {
                search.setOrderBy({
                    'phlu-neos-nodetypes-course-study-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-study-furthereducation-nr']].counter
                    },
                    'phlu-neos-nodetypes-course-module-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-module-furthereducation-nr']].counter
                    },
                    'phlu-neos-nodetypes-course-event-furthereducation': function (node) {
                        return $scope.filters.nr.selected.Alle == undefined ? 0 : $scope.filters.nr.selected.Alle[node.properties['phlu-neos-nodetypes-course-event-furthereducation-nr']].counter
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
    $scope.toggleFilterSelection = function (filterObject, category, filtername) {

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
                jQuery('html, body').stop().animate({
                    'scrollTop': jQuery(objId).offset().top
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
    search
        .enableCache()
        .setQuery('searchquery', $scope)
        .setNodeType('nodetypes', $scope)
        .setOrderBy({'*': '-id'})
        .addPropertyFilter('detailpage.hidden','false')
        .$watch(function (i) {

            if ($rootScope.isLoadedFirst == false && $scope.isLoadingFirst == false) {
                $scope.setIsLoadedFirst();
            }


        })
        .$bind('result', $scope);

    angular.forEach($scope.filters, function (filter, name) {


        if (filter.fulltext !== undefined && filter.fulltext) {
            search.addPropertyFilter(filter.property, 'filters.' + name + '.selectedValues', $scope, filter.reverse == undefined ? false : filter.reverse, false, false, true);
        } else {
            search.addPropertyFilter(filter.property, 'filters.' + name + '.selectedValues', $scope, filter.reverse == undefined ? false : filter.reverse);
        }

    });

    search.run();


}]);

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



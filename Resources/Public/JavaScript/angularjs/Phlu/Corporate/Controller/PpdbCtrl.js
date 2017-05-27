PhluCorporateApp.controller('PpdbCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    var list = new $hybridsearchObject(hybridsearch);
    list.enableCache();


    $scope.result = new $hybridsearchResultsObject();
    $scope.search = '';
    $scope.projecttype = 'Forschung und Entwicklung';
    $scope.filterLifetime = {};
    $scope.financingtype = {};
    $scope.projectparticipants = {};
    $scope.researchmainfocus = {};
    $scope.organisations = {};
    $scope.organisationunits = {};
    $scope.researchunit = {};
    $scope.initialFilters = {};
    $scope.limit = 5;
    $scope.limitChunkSize = 5;
    $scope.showResultsListOnDemand = false;
    $scope.isopen = 0;
    $scope.nodesByIdentifier = [];

    $scope.clearFilter = function (filtertype) {
        $scope[filtertype] = {};
    };


    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };

    $scope.addNodesByIdentifier = function (nodes) {
        angular.forEach(nodes, function (node) {
            $scope.nodesByIdentifier.push(node);
        });
    }

    $scope.addPropertyFilter = function (property, value) {
        list.addPropertyFilter(property, value, $scope);
    }

    $scope.setQuery = function (value) {
        list.setQuery(value, $scope);
    }
    $scope.setQueryInitial = function (value) {
        list.setQuery(value);
    }

    $scope.setFilterLifetime = function (f) {
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

    $scope.setFilterOrganisations = function (f) {
        $scope.initialFilters['organisations'] = true;
        $scope.organisations = f;
    };

    $scope.setFilterProjectType = function (f) {
        $scope.initialFilters['projecttype'] = true;
        var p = [];
        try {
            p = JSON.parse(f);
        } catch (errro) {
            p = f;
        }
        if (p.length) {
            $scope.projecttype = p;
        } else {
            $scope.projecttype = [];
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
    $scope.setOpen = function (node, index) {
        $scope.isopen = $scope.isopen === node.identifier ? 0 : node.identifier;
    };

    /**
     * @public
     * Set max results
     * @param integer limit
     * @returns void
     */
    $scope.setMaxItems = function (limit) {

        list.setLimit(limit);

    };

    /**
     * @public
     * Set order by
     * @param string limit
     * @returns void
     */
    $scope.setOrderBy = function (orderby) {

        if (orderby != 0) {
            list.setOrderBy({'*': orderby})
        } else {
            list.setOrderBy({'*': '__index'})
        }

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

    //
    // $scope.$watch('initialFilters', function (d) {
    //     console.log(d);
    // }, true);

    $scope.isShowingResultList = function () {

        if ($scope.showResultsListOnDemand == false) {
            return true;
        }

        if ($scope.sizeOf($scope.projectparticipants)) {
            return true;
        }

        if ($scope.sizeOf($scope.researchmainfocus)) {
            return true;
        }

        if ($scope.sizeOf($scope.filterLifetime)) {
            return true;
        }

        if ($scope.sizeOf($scope.organisationunits)) {
            return true;
        }

        if ($scope.search.length > 0) {
            return true;
        }


        return false;
    }



    $scope.run = function () {

        list
            //.disableRealtime()
            .addPropertyFilter('organisationunits.id', 'organisations', $scope)
            .addPropertyFilter('organisationunits.id', 'organisationunits', $scope)
            .addPropertyFilter('lifetime', 'filterLifetime', $scope)
            .addPropertyFilter('researchmainfocus.ID', 'researchmainfocus', $scope)
            .addPropertyFilter('researchunit.ID', 'researchunit', $scope)
            .addPropertyFilter('financingtypes', 'financingtype', $scope)
            .addPropertyFilter('participants.*.EventoID', 'projectparticipants', $scope)
            .addPropertyFilter('projecttype', 'projecttype', $scope)
            .addPropertyFilter('title', '', null, true)


        if ($scope.nodesByIdentifier.length) {
            list.addNodesByIdentifier($scope.nodesByIdentifier);
        } else {
            list.setNodeType('phlu-neos-nodetypes-project');
        }


        list.$bind('result', $scope)
        .run();

    }

}]);

PhluCorporateApp.controller('PpdbPublicationCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    list = new $hybridsearchObject(hybridsearch);
    list.enableCache();

    $scope.result = new $hybridsearchResultsObject();
    $scope.participants = {};
    $scope.organisations = {};
    $scope.publicationtype = {};
    $scope.initialFilters = {};
    $scope.participantsSearch = '';
    $scope.limit = {};
    $scope.limitChunkSize = 5;

    $scope.clearFilter = function (filtertype) {
        $scope[filtertype] = {};
    };

    $scope.setQuery = function (value) {
        list.setQuery(value, $scope);
    }

    $scope.setFilterParticipants = function (f) {
        $scope.participants = f;
        $scope.initialFilters['participants'] = true;
    };

    $scope.setFilterOrganisations = function (f) {
        $scope.organisations = f;
        $scope.initialFilters['organisations'] = true;
    };

    $scope.setFilterPublicationType = function (f) {
        $scope.publicationtype = f;
        $scope.initialFilters['publicationtype'] = true;
    };

    $scope.loadMore = function (group, objId) {
        if ($scope.limit[group] === undefined) {
            $scope.limit[group] = $scope.limitChunkSize;
        }

        $scope.limit[group] = $scope.limit[group] + $scope.limitChunkSize;
        window.setTimeout(function () {
            if (jQuery(objId).length) {
                jQuery('html, body').stop().animate({
                    'scrollTop': jQuery(objId).offset().top
                }, 900, 'swing', function () {

                });
            }
        }, 10);
    };

    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };

    $scope.getLimit = function (group) {
        return $scope.limit[group] == undefined ? $scope.limitChunkSize : $scope.limit[group];

    };


    var boost = {

        'phlu-neos-nodetypes-publication-date': -1,
        'phlu-neos-nodetypes-publication-grandparent': -1,
        'phlu-neos-nodetypes-publication-id': -1,
        'phlu-neos-nodetypes-publication-language': -1,
        'phlu-neos-nodetypes-publication-publicationtype': -1,
        'phlu-neos-nodetypes-publication-title': -1,
        'phlu-neos-nodetypes-publication-sortingkey': 500,
        'url': -1,
        'grandparent': -1


    };



    list
        .setPropertiesBoost(boost)
        .setCategorizedBy('publicationtype.name')
        .setOrderBy({'phlu-neos-nodetypes-publication': function(node) {return (10000-parseInt(node.properties['phlu-neos-nodetypes-publication-sortingkey'].substr(0,4)));}})
        .setNodeType('phlu-neos-nodetypes-publication')
        .addPropertyFilter('title', '', null, true)
        .addPropertyFilter('persons.EventoID', 'participants', $scope)
        .addPropertyFilter('publicationtype.id', 'publicationtype', $scope)
        .addPropertyFilter('organisations.OrganisationId', 'organisations', $scope)
        .$bind('result', $scope)
        .run();


}]);


PhluCorporateApp.filter('toArray', function () {
    return function (obj, addKey) {
        if (!angular.isObject(obj)) return obj;
        if (addKey === false) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        } else {
            return Object.keys(obj).map(function (key) {
                var value = obj[key];
                return angular.isObject(value) ?
                    Object.defineProperty(value, '$key', {enumerable: false, value: key}) :
                    {$key: key, $value: value};
            });
        }
    };
});

PhluCorporateApp.filter('inArrayFilter', function () {
    return function (input, term) {

        if (term === undefined || term == '') {
            return input;
        }

        var collection = {};

        angular.forEach(input, function (val, key) {

            if (JSON.stringify(val.value).toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                collection[key] = val;
            }

        });


        return collection;

    };
});


PhluCorporateApp.controller('PpdbCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.search = '';
    $scope.projecttype = 'Forschung und Entwicklung';
    $scope.filterLifetime = {};
    $scope.financingtype = {};
    $scope.projectparticipants = {};
    $scope.researchmainfocus = {};
    $scope.organisations = {};
    $scope.researchunit = {};
    $scope.initialFilters = {};
    $scope.limit = 5;
    $scope.limitChunkSize = 5;
    $scope.showResultsListOnDemand = false;
    $scope.isopen = 0;

    $scope.clearFilter = function(filtertype) {
        $scope[filtertype] = {};
    };

    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };

    $scope.addPropertyFilter = function (property, value) {
        $scope.list.addPropertyFilter(property, value, $scope);
    }

    $scope.setQuery = function (value) {
        $scope.list.setQuery(value, $scope);
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
        } catch(errro) {
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
    $scope.setOpen = function (node,index) {
        $scope.isopen = $scope.isopen === node.identifier ? 0 : node.identifier;

        window.setTimeout(function() {
            if (jQuery("#node-" + index).length) {
                jQuery('html, body').stop().animate({
                    'scrollTop': jQuery("#node-" + index).offset().top - (jQuery("#node-" + index).height() / 2)
                }, 900, 'swing', function () {

                });
            }
        },10);


    };

    /**
     * @private
     * Load more
     * @returns integer
     */
    $scope.loadMore = function (objId) {

        $scope.limit = $scope.limit + $scope.limitChunkSize;
        window.setTimeout(function() {
            if (jQuery(objId).length) {
                jQuery('html, body').stop().animate({
                    'scrollTop': jQuery(objId).offset().top
                }, 900, 'swing', function () {

                });
            }
        },10);

    };

    //
    // $scope.$watch('initialFilters', function (d) {
    //     console.log(d);
    // }, true);

    $scope.isShowingResultList = function() {

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

        if ($scope.search.length > 0) {
            return true;
        }



        return false;
    }

    $scope.list
        .setOrderBy({'phlu-neos-nodetypes-project': 'title'})
        .addPropertyFilter('organisationunits.id', 'organisations', $scope)
        .addPropertyFilter('lifetime', 'filterLifetime', $scope)
        .addPropertyFilter('researchmainfocus.ID', 'researchmainfocus', $scope)
        .addPropertyFilter('researchunit.ID', 'researchunit', $scope)
        .addPropertyFilter('financingtypes', 'financingtype', $scope)
        .addPropertyFilter('participants.*.EventoID', 'projectparticipants', $scope)
        .addPropertyFilter('projecttype', 'projecttype', $scope)
        .addPropertyFilter('title', '', null, true)
        .setNodeType('phlu-neos-nodetypes-project')
        .$bind('result', $scope)
        .run();


}]);

PhluCorporateApp.controller('PpdbPublicationCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.participants = {};
    $scope.organisations = {};
    $scope.publicationtype = {};
    $scope.initialFilters = {};
    $scope.participantsSearch = '';
    $scope.limit = {};
    $scope.limitChunkSize = 5;

    $scope.clearFilter = function(filtertype) {
        $scope[filtertype] = {};
    };

    $scope.setQuery = function (value) {
        $scope.list.setQuery(value, $scope);
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

    $scope.loadMore = function (group,objId) {
        if ($scope.limit[group] === undefined) {
            $scope.limit[group] = $scope.limitChunkSize;
        }

        $scope.limit[group] = $scope.limit[group] + $scope.limitChunkSize;
        window.setTimeout(function() {
            if (jQuery(objId).length) {
                jQuery('html, body').stop().animate({
                    'scrollTop': jQuery(objId).offset().top
                }, 900, 'swing', function () {

                });
            }
        },10);
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


    $scope.list
        .setCategorizedBy('publicationtype.name')
        .setOrderBy({'phlu-neos-nodetypes-publication': 'citationstyle'})
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


PhluCorporateApp.controller('NewsCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    // var list = new $hybridsearchObject(hybridsearch);
    // $scope.result = new $hybridsearchResultsObject();
    //
    // list
    //     .setCategorizedBy('documentnode.identifier')
    //     .setNodeType('Phlu.Corporate:Page.News')
    //     .$bind('result', $scope)
    //     .run();


    var list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.search = '';
    $scope.filterCategory = {};
    $scope.initialFilters = {};
    $scope.limit = 10;
    $scope.limitChunkSize = 10;
    $scope.isopen = 0;

    $scope.clearFilter = function (filtertype) {
        $scope[filtertype] = {};
    };

    $scope.sizeOf = function (obj) {
        if (obj === undefined) {
            return 0;
        }
        return Object.keys(obj).length;
    };

    $scope.setFilterCategory = function (f) {
        $scope.filterCategory = f;
        $scope.initialFilters['filterCategory'] = true;
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

    $scope.isShowingResultList = function () {
        if ($scope.search !== '') {
            return true;
        }

        if ($scope.sizeOf($scope.filterCategory)) {
            return true;
        }

        return false;
    };

    list
        .setQuery('search', $scope)
        .setNodeType('phlu-corporate-page-news')
        .addPropertyFilter('documentnode.properties.phlu-corporate-page-view-default-title', 'filterCategory', $scope)
        .$bind('result', $scope)
        .run();


}]);
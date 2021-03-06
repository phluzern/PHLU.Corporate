'use strict';

var PhluCorporateApp = angular.module('PhluCorporateApp', ['ngCookies', 'hybridsearch', 'ngSanitize']);
PhluCorporateApp.$$conf = {};


if (typeof document.addEventListener === 'function') {
    document.addEventListener('Neos.PageLoaded', function (event) {

        // re-compile angular app
        jQuery("*[data-ng-app]").each(function () {
            try {
                angular.bootstrap(jQuery(this), [jQuery(this).attr('data-ng-app')]);
            } catch (e) {
            }

        });

    }, false);

}


PhluCorporateApp.controller('initCtrl', ['$scope', 'hybridsearch', function ($scope, hybridsearch) {


    $scope.init = function (firebaseEndpoint, siteNodeName, workspaceName, dimensionHash) {

        hybridsearch(
            firebaseEndpoint,
            workspaceName,
            dimensionHash,
            siteNodeName
        );

    };


}]);

PhluCorporateApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

PhluCorporateApp.factory('hybridsearch', ['$hybridsearch', function ($hybridsearch) {

    return new $hybridsearch(
        PhluCorporateApp.$$conf.firebaseEndpoint,
        PhluCorporateApp.$$conf.workspaceName,
        PhluCorporateApp.$$conf.dimensionHash,
        PhluCorporateApp.$$conf.siteNodeName,
        PhluCorporateApp.$$conf.cdnHost,
        PhluCorporateApp.$$conf.cdnHostStatic
    );


}]);

PhluCorporateApp.controller('initController', ['$scope', '$hybridsearch', function ($scope, $hybridsearch) {


    $scope.init = function (firebaseEndpoint, siteNodeName, workspaceName, dimensionHash,cdnHost, cdnHostStatic) {

        PhluCorporateApp.$$conf.firebaseEndpoint = firebaseEndpoint;
        PhluCorporateApp.$$conf.workspaceName = workspaceName !== '' ? workspaceName : 'live';
        PhluCorporateApp.$$conf.siteNodeName = siteNodeName !== '' ? siteNodeName : 'corporate';
        PhluCorporateApp.$$conf.dimensionHash = dimensionHash !== '' ? dimensionHash : 'fb11fdde869d0a8fcfe00a2fd35c031d';
        PhluCorporateApp.$$conf.cdnHost = cdnHost  ? cdnHost : undefined;
        PhluCorporateApp.$$conf.cdnHostStatic = cdnHostStatic ? cdnHostStatic : undefined;
    };


}]);

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

PhluCorporateApp.filter('groupByProperty', function () {

    return function (items, property) {
        var filtered = [];
        var filteredObject = {};

        angular.forEach(items, function (item) {
            filteredObject[item.getProperty(property)] = item;
        });

        angular.forEach(filteredObject, function (item) {
            filtered.push(item);
        });



        return filtered;
    };
});


PhluCorporateApp.filter('searchTerm', ['$rootScope', function ($rootScope) {
    return function () {
        return $rootScope.siteSearch;
    };
}]);


PhluCorporateApp.filter('extractUri', function () {
    return function (input) {
        return $(input).attr('href');
    };
});


PhluCorporateApp.filter('rewriteUrl', function () {
    return function (input) {

       if (input.indexOf("iframe.phlu") > -1 && input.indexOf("index.php") == -1) {
         return input.replace("iframe.phlu.ch","www.phlu.ch");

       }

        return input;
    };
});


PhluCorporateApp.filter('debug', function () {
    return function (input) {

        return input;
    };
});

PhluCorporateApp.filter('striptags', function () {
    return function (input) {
        return input.replace(/<\/?[^>]+(>|$)/g, "");
    };
});
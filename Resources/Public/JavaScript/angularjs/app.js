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
        PhluCorporateApp.$$conf.cdnHost
    );


}]);

PhluCorporateApp.controller('initController', ['$scope', '$hybridsearch', function ($scope, $hybridsearch) {


    $scope.init = function (firebaseEndpoint, siteNodeName, workspaceName, dimensionHash) {

        PhluCorporateApp.$$conf.firebaseEndpoint = firebaseEndpoint;
        PhluCorporateApp.$$conf.workspaceName = workspaceName !== '' ? workspaceName : 'live';
        PhluCorporateApp.$$conf.siteNodeName = siteNodeName !== '' ? siteNodeName : 'corporate';
        PhluCorporateApp.$$conf.dimensionHash = dimensionHash !== '' ? dimensionHash : 'fb11fdde869d0a8fcfe00a2fd35c031d';
        PhluCorporateApp.$$conf.cdnHost = window.location.host == 'phlu.ch.phlu-eduweb5.nine.ch' ? 'https://dhummbq34u1xf.cloudfront.net' : undefined;
        PhluCorporateApp.$$conf.cdnStaticHost = window.location.host == 'phlu.ch.phlu-eduweb5.nine.ch' ? 'https://d912ndzw4fx9a.cloudfront.net' : undefined;
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


PhluCorporateApp.filter('debug', function () {
    return function (input) {
        console.log(input);
        return input;
    };
});
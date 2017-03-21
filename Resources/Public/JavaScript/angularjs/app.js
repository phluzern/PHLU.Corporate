'use strict';

var PhluCorporateApp = angular.module('PhluCorporateApp', ['ngCookies','hybridsearch','ngSanitize']);
PhluCorporateApp.$$conf = {};


if (typeof document.addEventListener === 'function') {
    document.addEventListener('Neos.PageLoaded', function(event) {

        // re-compile angular app
        jQuery("*[data-ng-app]").each(function() {
            try {
                angular.bootstrap(jQuery(this), [jQuery(this).attr('data-ng-app')]);
            } catch (e) {}

        });

    }, false);




}


PhluCorporateApp.controller('initCtrl', ['$scope','hybridsearch', function ($scope,hybridsearch) {


    $scope.init = function (firebaseEndpoint, siteNodeName, workspaceName, dimensionHash) {

        hybridsearch(
            firebaseEndpoint,
            workspaceName,
            dimensionHash,
            siteNodeName
        );

    };


}]);



PhluCorporateApp.factory('hybridsearch', ['$hybridsearch', function ($hybridsearch) {

        return new $hybridsearch(
            PhluCorporateApp.$$conf.firebaseEndpoint,
            PhluCorporateApp.$$conf.workspaceName,
            PhluCorporateApp.$$conf.dimensionHash,
            PhluCorporateApp.$$conf.siteNodeName,
            PhluCorporateApp.$$conf.cdnHost
            );


}]);

PhluCorporateApp.controller('initController', ['$scope','$hybridsearch', function ($scope,$hybridsearch) {


  $scope.init = function(firebaseEndpoint,siteNodeName,workspaceName,dimensionHash) {
          PhluCorporateApp.$$conf.firebaseEndpoint = firebaseEndpoint;
          PhluCorporateApp.$$conf.workspaceName = workspaceName;
          PhluCorporateApp.$$conf.siteNodeName = siteNodeName;
          PhluCorporateApp.$$conf.dimensionHash = dimensionHash;
          PhluCorporateApp.$$conf.cdnHost = 'https://d2desbmrc4hxtg.cloudfront.net';
  };


}]);

'use strict';

var PhluCorporateApp = angular.module('PhluCorporateApp', ['ngCookies','hybridsearch','ngSanitize']);



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



PhluCorporateApp.factory('hybridsearch', ['$hybridsearch', function ($hybridsearch) {

    var hybridseachinstance = new $hybridsearch(
        'https://phlu-neos.firebaseio.com',
        'live',
        'fb11fdde869d0a8fcfe00a2fd35c031d',
        'corporate'
    );

    return hybridseachinstance;


}]);

'use strict';

var PHLUCorporateApp = angular.module('PHLUCorporateApp', ['ngCookies','hybridsearch','ngSanitize']);



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



PHLUCorporateApp.factory('hybridsearch', ['$hybridsearch', function ($hybridsearch) {

    return new $hybridsearch(
        'https://phlu-f98dd.firebaseio.com',
        'live',
        'fb11fdde869d0a8fcfe00a2fd35c031d'
    );


}]);

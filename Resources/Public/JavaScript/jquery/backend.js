/**
 * Created by paafelder on 11.04.16.
 */

$(document).ready(function () {

    document.addEventListener('Neos.NodeCreated', function(event) {
        if ($(event.detail.element).attr('typeof') == 'typo3:PHLU.Corporate:Section') {
            Typo3Neos.Content.reloadPage();
        }
    }, false);

    document.addEventListener('Neos.NodeRemoved', function(event) {
        if ($(event.detail.element).attr('typeof') == 'typo3:PHLU.Corporate:Section') {
            Typo3Neos.Content.reloadPage();
        }
    }, false);



});
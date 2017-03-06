/**
 * Created by paafelder on 11.04.16.
 */

$(document).ready(function () {

    document.addEventListener('Neos.NodeCreated', function(event) {
        if ($(event.detail.element).attr('typeof') == 'typo3:Phlu.Corporate:Section' || $(event.detail.element).attr('typeof') == 'typo3:Phlu.Corporate:ContactsGroup') {
            Typo3Neos.Content.reloadPage();
        }
    }, false);

    document.addEventListener('Neos.NodeRemoved', function(event) {
        if ($(event.detail.element).attr('typeof') == 'typo3:Phlu.Corporate:Section' || $(event.detail.element).attr('typeof') == 'typo3:Phlu.Corporate:ContactsGroup') {
            Typo3Neos.Content.reloadPage();
        }
    }, false);


    document.addEventListener('Neos.PageLoaded', function(event) {
        initFrontend();
    }, false);


    // override aloha repository for inline editing link editor
    var customAlohaAssetRepositoryOverride = false;
    if (typeof document.addEventListener === 'function') {

        document.addEventListener('Neos.NodeSelected', function (event) {
            if (customAlohaAssetRepositoryOverride === false && Aloha != undefined && Aloha.RepositoryManager != undefined && Aloha.RepositoryManager.getRepository('asset-repository')) {
                Aloha.RepositoryManager.getRepository('asset-repository').getQueryRequestData = function(searchTerm) {
                    return {
                        searchTerm: '!'
                    };
                };
                customAlohaAssetRepositoryOverride = true;
            }

        }, false);
    }



});
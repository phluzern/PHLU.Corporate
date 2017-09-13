PhluCorporateApp.controller('LogCtrl', ['$scope', '$cookies','$window', function ($scope, $cookies, $window) {


    var NodeLogger = function (identifier, nodeType, uri) {

        var node = {
            identifier: identifier,
            nodeType: nodeType,
            uri: uri
        }

        return {
            getNodeType: function () {
                return node.nodeType;
            },
            getIdentifier: function () {
                return node.identifier;
            },
            getUri: function () {
                return node.uri;
            }
        }

    }


    $scope.setLogStore = function (identifier, nodeType, uri) {

        var log = new NodeLogger(identifier, nodeType, uri);

        if (log.getNodeType() == 'Phlu.Corporate:Page.FurtherEducation.Detail.Study' || log.getNodeType() == 'Phlu.Corporate:Page.FurtherEducation.Detail.Module') {
            var storage = $window.localStorage['furtherEducationNodesVisited'];
            var visited = {};

            try {
                if (storage !== undefined) {
                    angular.forEach(angular.fromJson(storage), function (val, key) {
                        if (Object.keys(visited).length < 10) {
                            visited[key] = val;
                        }
                    });
                }
            } catch (e) {
                // clear storage
                $window.localStorage['furtherEducationNodesVisited'] = {};
            }

            visited[log.getUri()] = new Date().getTime();
            $window.localStorage['furtherEducationNodesVisited'] = angular.toJson(visited);

        }

        // create ga event for qmpilot downloads

        jQuery(document).click(function(e) {
            var c = jQuery(e.target).closest('.phlu-qmpilot-nodetypes-file');
            if (c.length) {

                ga('send', 'event', {
                    'eventCategory': 'Dateien',
                    'eventAction': c.attr('data-asset-target'),
                    'eventLabel': 'Referrer://' + log.getUri()
                });

            }
        });



    }


}]);

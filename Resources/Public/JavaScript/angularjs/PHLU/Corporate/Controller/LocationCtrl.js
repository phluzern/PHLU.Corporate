PHLUCorporateApp.controller('LocationCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', '$element', '$rootScope', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject, $element, $rootScope) {

    $scope.map = false;
    var mapElement = $($element).find('.locationsMap')[0];

    var directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true
    });
    var directionsService = new google.maps.DirectionsService();
    var markers = {};

    if ($rootScope.infowindows === undefined) {
        $rootScope.infowindows = {};
    }

    var list = new $hybridsearchObject(hybridsearch);

    $scope.result = new $hybridsearchResultsObject();
    $scope.locations = {};
    $scope.isShowingAll = false;


    $scope.toggleLocation = function (id) {

        if ($scope.isShowingAll) {
            $scope.toggleShowAllLocations();
        }
        $scope.locations[id] = $scope.locations[id] ? false : true;


    }

    $scope.toggleShowAllLocations = function (id) {
        if ($scope.isShowingAll) {
            angular.forEach($scope.locations, function (value, nodeId) {
                $scope.locations[nodeId] = false;
            });

        } else {
            $scope.showAllLocations();
        }
    }


    $scope.showAllLocations = function () {

        angular.forEach($scope.result.getNodes(), function (node) {
            $scope.locations[node.identifier] = true;
        });
        $scope.isShowingAll = true;
    }

    $scope.locationsMap = function () {


        var directions = {};
        $scope.durationText = '';

        if (!$scope.map) {
            $scope.map = new google.maps.Map(mapElement, {
                center: {lat: 47.0527191, lng: 8.3045493},
                zoom: 15
            });
            directionsDisplay.setMap($scope.map);
        } else {
            google.maps.event.trigger($scope.map, 'resize');
        }


        if (Object.keys($scope.locations).length === 0) {
            $scope.showAllLocations();
        } else {
            var showing = 0;
            angular.forEach($scope.locations, function (value) {
                if (value) {
                    showing++;
                }
            });
            if (showing !== $scope.result.count()) {
                $scope.isShowingAll = false;
            } else {
                $scope.isShowingAll = true;
            }

        }


        var activeMarkLatNng = [];
        var node = {};
        angular.forEach($scope.locations, function (status, nodeId) {


            if (status) {
                node = list.$$app.getResultNodeByIdentifier(nodeId);

                if (markers[nodeId] == undefined) {
                    var marker = new google.maps.Marker({
                        position: {lat: parseFloat(node.getProperty('lat')), lng: parseFloat(node.getProperty('lng'))},
                        map: $scope.map,
                        title: node.getProperty('name')
                    });
                    markers[nodeId] = marker;

                    $rootScope.infowindows[nodeId] = new google.maps.InfoWindow({
                        content: '<div class="info">' + node.getProperty('name') + '</div>'
                    });

                    $rootScope.infowindows[nodeId].open($scope.map, marker);


                } else {
                    markers[nodeId].setMap($scope.map);
                    markers[nodeId].setPosition({
                        lat: parseFloat(node.getProperty('lat')),
                        lng: parseFloat(node.getProperty('lng'))
                    });

                    if ($rootScope.infowindows[nodeId]) {
                        $rootScope.infowindows[nodeId].setContent('<div class="info">' + node.getProperty('name') + '</div>');
                    }

                }
                activeMarkLatNng.push(new google.maps.LatLng(parseFloat(node.getProperty('lat')), parseFloat(node.getProperty('lng'))));
            } else {
                if (markers[nodeId] !== undefined) {
                    markers[nodeId].setMap(null);

                }
            }


        });

        directionsDisplay.setDirections({routes: []});

        if (activeMarkLatNng.length == 2) {
            // show route

            var waypoints = [];
            for (i = 1; i < activeMarkLatNng.length; i++) {
                waypoints.push({location: activeMarkLatNng[i], stopover: true});
            }

            var request = {
                origin: activeMarkLatNng[0],
                optimizeWaypoints: false,
                destination: activeMarkLatNng[1],
                travelMode: google.maps.TravelMode['WALKING'],
                waypoints: waypoints
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);


                    directionsDisplay.setOptions({suppressMarkers: true});


                    directions.TotalDistance = 0;
                    directions.Segments = [];
                    var totalDuration = 0;
                    var markerArray = [];

                    var route = response.routes[0];
                    // For each route, display summary information.
                    for (var i = 0; i < route.legs.length; i++) {


                        var legDistance = route.legs[i].distance.value; // distance in meters need to devide by 1000 for Km
                        directions.TotalDistance = directions.TotalDistance + legDistance / 1000;

                        var legDuration = route.legs[i].duration.value; // travel time in seconds
                        totalDuration = totalDuration + legDuration;

                        directions.Segments.push({
                            Start: route.legs[i].start_address,
                            End: route.legs[i].end_address,
                            Travel: route.legs[i].distance.text,
                            Duration: route.legs[i].duration.text
                        });
                    }

                    var nodeSet = {};
                    angular.forEach(markers, function (marker, nodeId) {

                        if ($rootScope.infowindows[nodeId]) {
                            if (nodeSet[nodeId] === undefined && $rootScope.infowindows[nodeId].getContent().indexOf("class='duration'") === -1) {
                                $rootScope.infowindows[nodeId].setContent($rootScope.infowindows[nodeId].getContent() + "<div class='duration'><b>Zu Fuss " + directions.Segments[0].Duration + " (" + directions.Segments[0].Travel + ")</b></div>");
                                nodeSet[nodeId] = true;
                            }
                        }

                    });


                }
            });
        }


        if (activeMarkLatNng.length === 1) {
            var center = new google.maps.LatLng(parseFloat(node.getProperty('lat')), parseFloat(node.getProperty('lng')));
            $scope.map.panTo(center);
        }


    }

    $scope.$watch('locations', function () {
        $scope.locationsMap();
    }, true);

    $scope.addNodes = function (nodes) {
        var nodesIds = [];

        angular.forEach(nodes, function (node) {
            nodesIds.push(node.identifier);
        });

        list.addNodesByIdentifier(nodesIds);
        //$scope.locationsMap();
    };

    $scope.addNode = function (node) {
        var nodesIds = [];
        nodesIds.push(node);
        list.addNodesByIdentifier(nodesIds);
    };


    if ($(mapElement).hasClass('phlu-locations-search')) {

        list
            .addPropertyFilter('street', '', null, true)
            .$watch(function (data) {
                $scope.showAllLocations();
                $scope.locationsMap();
            })
            .$bind('result', $scope)
            .run();

    } else {

        list
            .setNodeType('phlu-corporate-location')
            .setNodePath('/ueber-uns/standorte/')
            .$watch(function (data) {
                $scope.locationsMap();
            })
            .$bind('result', $scope)
            .run();

    }


}]);

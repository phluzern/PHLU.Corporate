PHLUCorporateApp.controller('LocationCtrl', ['$scope', 'hybridsearch', '$hybridsearchObject', '$hybridsearchResultsObject', function ($scope, hybridsearch, $hybridsearchObject, $hybridsearchResultsObject) {

    var map = false;
    var markers = {};
    $scope.list = new $hybridsearchObject(hybridsearch);
    $scope.result = new $hybridsearchResultsObject();
    $scope.locations = {};
    $scope.isShowingAll = false;

    $scope.toggleLocation = function (id) {
        $scope.locations[id] = $scope.locations[id] ? false : true;
    }

    $scope.toggleShowAllLocations = function (id) {
        if ($scope.isShowingAll) {
            angular.forEach($scope.locations, function (value,nodeId) {
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

        if (!map) {
            map = new google.maps.Map(document.getElementById('LocationsMap'), {
                center: {lat: 47.0527191, lng: 8.3045493},
                zoom: 15
            });


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


        var lcount = 0;
        var node = {};
        angular.forEach($scope.locations, function (status, nodeId) {


            if (status) {
                node = $scope.list.$$app.getResultNodeByIdentifier(nodeId);
                if (markers[nodeId] == undefined) {
                    var marker = new google.maps.Marker({
                        position: {lat: parseFloat(node.getProperty('lat')), lng: parseFloat(node.getProperty('lng'))},
                        map: map,
                        title: node.getProperty('name')
                    });
                    markers[nodeId] = marker;

                    var infowindow = new google.maps.InfoWindow({
                        content: '<div class="info">' + node.getProperty('name') + '</div>'
                    });

                    infowindow.open(map, marker);


                } else {
                    markers[nodeId].setMap(map);
                    markers[nodeId].setPosition({
                        lat: parseFloat(node.getProperty('lat')),
                        lng: parseFloat(node.getProperty('lng'))
                    });
                }
                lcount++;
            } else {
                if (markers[nodeId] !== undefined) {
                    markers[nodeId].setMap(null);

                }
            }


        });


        if (lcount === 1) {
            var center = new google.maps.LatLng(parseFloat(node.getProperty('lat')), parseFloat(node.getProperty('lng')));
            map.panTo(center);
        }


    }

    $scope.$watch('locations', function () {
        $scope.locationsMap();

    }, true);


    $scope.list
        .setNodeType('phlu-corporate-location')
        .setNodePath('/ueber-uns/standorte/')
        .$watch(function (data) {
            $scope.locationsMap();
        })
        .$bind('result', $scope)
        .run();


}]);

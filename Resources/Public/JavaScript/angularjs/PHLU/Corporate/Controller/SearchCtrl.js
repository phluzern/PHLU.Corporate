// PHLU.Corporate:Page.View.Default filter tag navigation
PHLUCorporateApp.controller('SearchCtrl', ['$scope', '$timeout', '$cookies', function ($scope) {

    var config, getData, getSearchTerms, resetData, getSpecialTerm, applyData, searchData, database, lunrSearch;
    var filterReg = /[^0-9a-zA-ZöäüÖÄÜ]/g;

    // Initialize Firebase
    config = {
        apiKey: "4h2MfKKtGkpsBCg0tcxoRzvVnmiFapCv6L3UqfWZ",
        authDomain: "phlu-f98dd.firebaseapp.com",
        databaseURL: "https://phlu-f98dd.firebaseio.com",
        storageBucket: "phlu-f98dd.appspot.com",
        path: "/search/",
        boost: {
            contact: 100,
            firstname: 100,
            lastname: 100,
            uriPathSegment: 150,
            phone: 35,
            street: 20,
            email: 10,
            title: 40,
            text: 1
        }
    };

    $scope.siteSearch = '';
    $scope.terms = {};
    $scope.searchResult = [];

    // initialize firebase database
    firebase.initializeApp(config);
    database = firebase.database();

    // initialize lunr search engine
    lunrSearch = elasticlunr(function () {
        this.setRef('id');
    });


    // Get a reference to the database service

    getData = function (term) {




        if (term !== '') {

            var termstart = term;
            if (term.length > 3) {
                // magic function. searches for "lehrerin" finds also "lehrer". searches for "lehrer" finds also "lehrpersonen"!
                termstart = term.substr(0, term.length-2);
            }


            database.ref(config.path)
                .orderByKey()
                .startAt(termstart)
                .limitToFirst(30)

                .on('value', function (snapshot) {

                    var b = [];
                    angular.forEach(snapshot.val(), function (val, key) {

                        if (key.substr(0, termstart.length) === termstart) {
                            b.push({key: key, length: key.length});
                        }

                    });


                    var endKey = b[b.length - 1];

                    if (endKey !== undefined) {

                        database.ref(config.path)
                            .orderByKey()
                            .startAt(term)
                            .endAt(endKey.key)

                            .on('value', function (snapshot) {
                                setTimeout(function () {

                                    if ($scope.terms[term] !== undefined) {

                                        angular.forEach(snapshot.val(), function (v, k) {
                                            $scope.terms[term].results = v;
                                            $scope.terms[term].terms = b;
                                        });

                                        $scope.$apply(); //this triggers a $digest

                                    }
                                }, 10);


                            });

                    }


                });


            // database.ref(config.path)
            //     .orderByKey()
            //     .startAt(term)
            //     .endAt(b)
            //
            //     .on('value', function (snapshot) {
            //     setTimeout(function () {
            //         if ($scope.terms[term] !== undefined) {
            //             $scope.terms[term].results = snapshot.val();
            //             $scope.$apply(); //this triggers a $digest
            //         }
            //     }, 10);
            //
            //
            // });


        }


    };



    // Get a reference to the database service

    getSpecialTerm = function (term) {

        // help to find phone numbers
        t = term.replace(/([0-9])( )/i, '$1');
        t = t.replace(/([0-9]{2})/gi, '$1 ');

        return term+" "+t;

    };

    resetData = function () {


        angular.forEach($scope.terms, function (val, key) {
            if (getSearchTerms().indexOf(key) < 0) {
                if ($scope.terms[key].results) {
                    angular.forEach($scope.terms[key].results, function (v, k) {
                        lunrSearch.removeDoc(val.term + "://" + v.identifier);
                    });
                }
                delete $scope.terms[key];
            }
        });

        searchData($scope.siteSearch);

    };

    getSearchTerms = function () {


        var terms = [];
        var s = $scope.siteSearch.toLowerCase().replace(filterReg, " ");
        s = getSpecialTerm(s);

        angular.forEach(s.split(" "), function (term, k) {
            term = term.replace(filterReg, "");
            if (term.length > 0) terms.push(term);
        });

        return terms;


    };


    applyData = function () {

        angular.forEach($scope.terms, function (val, key) {


            if (val.results) {

                angular.forEach(val.results, function (node) {

                    var doc = node.properties;

                    if (doc != undefined) {
                        angular.forEach(doc, function (val, key) {
                            if (lunrSearch.getFields().indexOf(key) < 0) {
                                lunrSearch.addField(key);
                            }
                        });

                        doc.id = key + '://' + node.identifier;
                        lunrSearch.addDoc(doc);
                    }

                });

            }


        });


    };

    searchData = function (term) {

        console.log(term);

        var resultsFinal = {};

        var fields = {};
        angular.forEach(lunrSearch.getFields(), function (v, k) {
            fields[v] = {boost:config.boost[v] === undefined ? 1: config.boost[v]}
        });

        var results = lunrSearch.search(term.toLowerCase().replace(filterReg, " "), {
            fields:fields,
            bool: "OR"
        });


        angular.forEach(results, function (input, key) {
            var t = input.ref.substr(0, input.ref.indexOf("://"));
            var id = input.ref.substr(input.ref.indexOf("://") + 3);

            if ($scope.terms[t] !== undefined && $scope.terms[t].results && $scope.terms[t].results[id]) {
                resultsFinal[id] = {
                    score: resultsFinal[id] !== undefined ? resultsFinal[id].score + input.score : input.score,
                    properties: $scope.terms[t].results[id].properties,
                    nodeType: $scope.terms[t].results[id].nodeType
                }

            }
        });


        $scope.searchResult = [];

        angular.forEach(resultsFinal, function (val, key) {
          $scope.searchResult.push(val);
        });




    };


    $scope.$watch('siteSearch', function (prop) {


        angular.forEach(getSearchTerms(), function (v) {
            if ($scope.terms[v] === undefined) {
                $scope.terms[v] = {term: v, results: {}};
                getData(v);
            }
        });

        resetData();

    });


    $scope.$watch('terms', function (prop) {
        resetData();
        applyData();

        var searchTerm = '';
        angular.forEach(prop, function (v) {
            angular.forEach(v.terms, function (t) {
                searchTerm += " " + t.key;
            });
        });


        searchData(searchTerm);
    }, true);


}]);




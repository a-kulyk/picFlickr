(function () {
    angular.module('picFlickr', ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
        .constant('myConfig', {
            'API_KEY': 'b2d2abbb64d86c5552a676795a58ae5c',
            'secret': '76778ce756ff9293',
            'base_url': 'https://api.flickr.com/services/rest/',
            'google_url': 'https://www.googleapis.com/customsearch/v1',
            'zero': 0,
            'one': 1,
            'three': 3,
            'ten': 10,
            'perPage': 30,
            'google_API_KEY': 'AIzaSyA45B20DzHZiNV4wHuIzyq_1FLNYhZo48E',
            'search_engine_id': '007906631053879618604:mgbelpcc874'
        })
        .config(routerConfig);

    routerConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function routerConfig ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .state('home.photo', {
                url: '/photo/:id',
                templateUrl: 'templates/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $locationProvider.hashPrefix('!');
    }
}());

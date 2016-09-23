(function () {
    angular.module('pic_flickr', ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'ngClipboard'])
        .constant('myConfig', {
            'API_KEY': 'b2d2abbb64d86c5552a676795a58ae5c',
            'secret': '76778ce756ff9293',
            'base_url': 'https://api.flickr.com/services/rest/',
            'perPage': 30,
            'one': 1,
            'zero': 0
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
            });

        // $urlRouterProvider.otherwise('home');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $locationProvider.hashPrefix('!');
    }
}());

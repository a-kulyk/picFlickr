(function () {
    angular.module('pic_flickr', ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
    .constant('myConfig', myConfig)
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

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $locationProvider.hashPrefix('!');
    }

    function myConfig () {
        return {
            'API_KEY': 'b2d2abbb64d86c5552a676795a58ae5c',
            'secret': '76778ce756ff9293'
        };
    }
}());

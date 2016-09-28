(function () {
    angular.module('pic_flickr', ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
        .constant('myConfig', {
            'API_KEY': 'b2d2abbb64d86c5552a676795a58ae5c',
            'secret': '76778ce756ff9293',
            'base_url': 'https://api.flickr.com/services/rest/',
            'perPage': 30,
            'one': 1,
            'three': 3,
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
            })
            .state('home.photo', {
                url: '/photo/:id',
                templateUrl: 'templates/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            });

        // $urlRouterProvider.otherwise('home');

        $locationProvider.html5Mode(true);
        // $locationProvider.hashPrefix('!');
    }
}());

(function () {
    angular.module('pic_flickr')
        .factory('FlickrService', ($http, $q, $resource, myConfig) => {
            return { search };

            function search (searchText, page) {
                var params = {
                    api_key: myConfig.API_KEY,
                    per_page: myConfig.perPage,
                    format: 'json',
                    nojsoncallback: myConfig.one,
                    text: searchText,
                    sort: 'relevance',
                    page: page && page > myConfig.zero ? page : myConfig.one,
                    method: searchText && searchText.length > myConfig.zero ? 'flickr.photos.search' : 'flickr.photos.getRecent'
                };

                return $http({ method: 'GET', url: myConfig.base_url, params })
                    .then(res => res.data);
            }
        });
}());


(function () {
    angular.module('pic_flickr')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$location', '$anchorScroll', '$q', 'FlickrService', '$log', 'ngClipboard', 'myConfig'];

    function MainController ($scope, $location, $anchorScroll, $q, FlickrService, $log, ngClipboard, myConfig) {
        var vm = this;

        vm.search = search;
        vm.openPhoto = openPhoto;
        // vm.paginator = paginator;
        vm.next = next;
        vm.previous = previous;
        vm.copyLink = copyLink;
        vm.close = close;
        search();

        function search (photoSearch, page) {
            $log.log(photoSearch);
            if (typeof page !== 'undefined' && vm.page === page) return;
            vm.loading = true;
            vm.showGallery = false;
            return FlickrService.search(photoSearch, page)
                .then(res => {
                    $log.log(res);
                    vm.photos = res.photos.photo;
                    vm.page = res.photos.page;
                    vm.pages = res.photos.pages;
                    paginator();
                    vm.loading = false;
                });
        }

        function openPhoto (id) {
            if (typeof vm.currentIndex !== 'undefined') vm.photos[vm.currentIndex].highlight = false;
            angular.forEach(vm.photos, (value, index) => {
                if (value.id === id) {
                    vm.currentIndex = parseInt(index, 10);
                    vm.currentPhoto = value;
                    vm.photos[vm.currentIndex].highlight = true;
                    vm.currentPhotoSrc = 'http://farm' + vm.currentPhoto.farm + '.static.flickr.com/' + vm.currentPhoto.server + '/'
                                    + vm.currentPhoto.id + '_' + vm.currentPhoto.secret + '_z.jpg';
                    return;
                }
            });
            vm.showGallery = true;
            
        }

        function paginator () {
            var i;

            vm.pageNav = [];

            if (vm.page > myConfig.one) vm.pageNav.push({text: '<< Back', number: vm.page - myConfig.one});

            for (i = myConfig.one; i <= vm.pages; i++)
                if (i === vm.page)
                    vm.pageNav.push({text: vm.page, number: vm.page, disabled: true});
                else
                    if (i >= vm.page - myConfig.three && i <= vm.page + myConfig.three)
                        vm.pageNav.push({text: i, number: i});

            if (vm.page < vm.pages)
                vm.pageNav.push({text: 'Next >>', number: vm.page + myConfig.one});
        }

        function next () {
            if (vm.currentIndex === vm.photos.length - myConfig.one)
                search(vm.photoSearch, vm.page + myConfig.one)
                .then(() => {
                    openPhoto(vm.photos[myConfig.zero].id);
                });
            else openPhoto(vm.photos[vm.currentIndex + myConfig.one].id);
        }

        function previous () {
            if (vm.currentIndex === myConfig.zero)
                if (vm.page > myConfig.one)
                    search(vm.photoSearch, vm.page - myConfig.one)
                    .then(() => {
                        openPhoto(vm.photos[vm.photos.length - myConfig.one].id);
                    });
                else return;
            else openPhoto(vm.photos[vm.currentIndex - myConfig.one].id);
        }

        function copyLink () {
            ngClipboard.toClipboard(vm.currentPhotoSrc);
        }

        function close () {
            vm.showGallery = false;
        }
    }
}());

(function () {
    angular.module('pic_flickr')

        .factory('ngClipboard', ngClipboard);

    ngClipboard.$inject = ['$compile', '$rootScope', '$document', 'myConfig'];

    function ngClipboard ($compile, $rootScope, $document, myConfig) {
        return {toClipboard};
        function toClipboard (element) {
            var copyElement, body, ngClipboardElement, range;

            copyElement = angular.element('<span id="ngClipboardCopyId">' + element + '</span>');
            body = $document.find('body').eq(myConfig.zero);

            body.append($compile(copyElement)($rootScope));

            ngClipboardElement = angular.element(document.getElementById('ngClipboardCopyId'));
            range = document.createRange();

            range.selectNode(ngClipboardElement[myConfig.zero]);

            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            document.execCommand('copy');

            window.getSelection().removeAllRanges();

            copyElement.remove();
        }
    }
}());


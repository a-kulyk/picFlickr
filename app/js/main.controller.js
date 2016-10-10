(function () {
    angular.module('picFlickr')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$location', '$anchorScroll', '$q', 'FlickrService', 'GoogleService', '$log', 'ngClipboard', 'myConfig'];

    function MainController ($scope, $location, $anchorScroll, $q, FlickrService, GoogleService, $log, ngClipboard, myConfig) {
        var vm = this;

        vm.search = search;
        vm.googleSearch = googleSearch;
        vm.openPhoto = openPhoto;
        vm.openGooglePhoto = openGooglePhoto;
        vm.next = next;
        vm.previous = previous;
        vm.copyLink = copyLink;
        vm.close = close;
        vm.goTop = goTop;
        search();

        function googleSearch (photoSearch, page) {
            $log.log(photoSearch);
            vm.photoSearch = photoSearch;
            vm.currentIndex = null;
            vm.googleSearching = false;
            vm.flickrSearching = false;
            vm.showGallery = false;
            vm.loading = true;
            return GoogleService.search(photoSearch, page)
                .then(res => {
                    $log.log('google_res: ', res);
                    vm.googlePhotos = res.items;
                    vm.pageNav = res.pageNav;
                    vm.page = res.currPage;
                    vm.pages = res.allPages;
                    vm.googleSearching = true;
                    vm.loading = false;
                });
        }

        function search (photoSearch, page) {
            $log.log(photoSearch);
            vm.photoSearch = photoSearch;
            if (typeof page !== 'undefined' && vm.page === page) return;
            vm.currentIndex = null;
            vm.loading = true;
            vm.flickrSearching = false;
            vm.googleSearching = false;
            vm.showGallery = false;
            return FlickrService.search(photoSearch, page)
                .then(res => {
                    $log.log('flickr_res:', res);
                    vm.photos = res.photos.photo;
                    vm.page = res.photos.page;
                    vm.pages = res.photos.pages;
                    vm.pageNav = res.pageNav;
                    vm.loading = false;
                    vm.flickrSearching = true;
                });
        }

        function openPhoto (index) {
            $log.log(index);
            vm.currentIndex = index;
            vm.currentPhoto = vm.photos[index];
            vm.currentPhotoSrc = 'https://farm' + vm.currentPhoto.farm + '.static.flickr.com/' + vm.currentPhoto.server + '/'
                            + vm.currentPhoto.id + '_' + vm.currentPhoto.secret + '_z.jpg';
            vm.showGallery = true;
        }

        function openGooglePhoto (index) {
            vm.currentIndex = index;
            vm.currentPhoto = vm.googlePhotos[index];
            vm.currentPhotoSrc = vm.googlePhotos[index].link;
            vm.showGallery = true;
        }

        function next () {
            if (vm.googleSearching) {
                if (vm.currentIndex === vm.googlePhotos.length - myConfig.one) {
                    vm.showGallery = false;
                    googleSearch(vm.photoSearch, vm.page + myConfig.one)
                    .then(() => {
                        openGooglePhoto(myConfig.zero);
                    });
                } else openGooglePhoto(vm.currentIndex + myConfig.one);
                return;
            }
            if (vm.currentIndex === vm.photos.length - myConfig.one) {
                vm.showGallery = false;
                search(vm.photoSearch, vm.page + myConfig.one)
                .then(() => {
                    openPhoto(myConfig.zero);
                });
            } else openPhoto(vm.currentIndex + myConfig.one);
        }

        function previous () {
            if (vm.googleSearching) {
                if (vm.currentIndex === myConfig.zero) {
                    if (vm.page === myConfig.one) return;
                    vm.showGallery = false;
                    googleSearch(vm.photoSearch, vm.page - myConfig.one)
                    .then(() => {
                        openGooglePhoto(vm.googlePhotos.length - myConfig.one);
                    });
                } else openGooglePhoto(vm.currentIndex - myConfig.one);
                return;
            }
            if (vm.currentIndex === myConfig.zero) {
                if (vm.page === myConfig.one) return;
                vm.showGallery = false;
                search(vm.photoSearch, vm.page - myConfig.one)
                .then(() => {
                    openPhoto(vm.photos.length - myConfig.one);
                });
            } else openPhoto(vm.currentIndex - myConfig.one);
        }

        function copyLink () {
            ngClipboard.toClipboard(vm.currentPhotoSrc);
        }

        function close () {
            vm.showGallery = false;
            vm.currentIndex = null;
        }

        function goTop () {
            $anchorScroll();
        }
    }
}());

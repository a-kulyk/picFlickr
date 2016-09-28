(function () {
    angular.module('picFlickr')
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
                    vm.currentPhotoSrc = 'https://farm' + vm.currentPhoto.farm + '.static.flickr.com/' + vm.currentPhoto.server + '/'
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

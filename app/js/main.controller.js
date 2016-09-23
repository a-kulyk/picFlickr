(function () {
    angular.module('pic_flickr')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$location', '$anchorScroll', 'FlickrService', '$log', 'ngClipboard', 'myConfig'];

    function MainController ($scope, $location, $anchorScroll, FlickrService, $log, ngClipboard, myConfig) {
        var vm = this;

        vm.search = search;
        vm.openPhoto = openPhoto;
        vm.next = next;
        vm.previous = previous;
        vm.copyLink = copyLink;
        search();

        function search () {
            vm.loading = true;
            vm.showGallery = false;
            $log.log(vm.photo_search);
            FlickrService.search(vm.photo_search)
                .then(res => {
                    $log.log(res);
                    vm.photos = res.photos.photo;
                    vm.loading = false;
                });
        }

        function openPhoto (id) {
            angular.forEach(vm.photos, (value, index) => {
                if (value.id === id) {
                    vm.currentIndex = parseInt(index, 10);
                    vm.currentPhoto = value;
                    vm.currentPhotoSrc = 'http://farm' + vm.currentPhoto.farm + '.static.flickr.com/' + vm.currentPhoto.server + '/' +
                                     vm.currentPhoto.id + '_' + vm.currentPhoto.secret + '_z.jpg';
                    return;
                }
            });
            vm.showGallery = true;
            $location.hash('gallery');
            $anchorScroll();
        }

        function next () {
            if (vm.currentIndex === vm.photos.length - myConfig.one) return;
            openPhoto(vm.photos[vm.currentIndex + myConfig.one].id);
        }

        function previous () {
            if (vm.currentIndex === myConfig.zero) return;
            openPhoto(vm.photos[vm.currentIndex - myConfig.one].id);
        }

        function copyLink () {
            ngClipboard.toClipboard(vm.currentPhotoSrc);
        }
    }
}());

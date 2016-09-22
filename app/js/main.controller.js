(function () {
    angular.module('pic_flickr')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', 'FlickrService', '$log'];

    function MainController ($scope, FlickrService, $log) {
        var vm = this;
        
        vm.loading = true;
        vm.search = search;

        function search () {
            

            $log.log(vm.photo_search);
            FlickrService.search(vm.photo_search)
                .then(res => {
                    $log.log(res);
                    vm.photos = res.photos.photo;
                    vm.loading = false;
                });
        }
    }
}());

(function () {
    angular.module('pic_flickr')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', 'FlickrService'];

    function MainController ($scope, FlickrService) {
        var vm = this;

        console.log(vm.photo_search);
    }


}());



// app.factory('Flickr', function($resource, $q) {
//   var photosPublic = $resource('http://crossorigin.me/https://api.flickr.com/services/feeds/photos_public.gne?tags=trees&format=json', 
//       { format: 'json', jsoncallback: 'JSON_CALLBACK' }, 
//       { 'load': { 'method': 'JSONP' } });
//   return {
//     get: function() {
//       var q = $q.defer();
//       photosPublic.load(function(resp) {
//         q.resolve(resp);
//         console.log(resp.items);
//       })
//       return q.promise;
//     }
//   }
// });
// app.controller('FlickrCtrl', function($scope, Flickr) {
// Flickr.get();
// });

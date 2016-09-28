(function () {
    angular.module('picFlickr')
        .factory('FlickrService', FlickrService);

    FlickrService.$inject = ['$http', '$resource', 'myConfig'];

    function FlickrService ($http, $resource, myConfig) {
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
    }
}());

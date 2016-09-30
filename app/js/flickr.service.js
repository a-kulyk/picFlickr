(function () {
    angular.module('picFlickr')
        .factory('FlickrService', FlickrService);

    FlickrService.$inject = ['$http', 'myConfig'];

    function FlickrService ($http, myConfig) {
        return { search };

        function search (searchText, page) {
            var params = {
                api_key: myConfig.API_KEY,
                per_page: myConfig.ten,
                safe_search: myConfig.one,
                privacy_filter: myConfig.one,
                format: 'json',
                nojsoncallback: myConfig.one,
                text: searchText,
                sort: 'relevance',
                page: page && page > myConfig.zero ? page : myConfig.one,
                method: searchText ? 'flickr.photos.search' : 'flickr.photos.getRecent'
            };

            return $http({ method: 'GET', url: myConfig.base_url, params })
                .then(res => res.data);
        }
    }
}());

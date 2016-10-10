(function () {
    angular.module('picFlickr')
        .factory('FlickrService', FlickrService);

    FlickrService.$inject = ['$http', 'myConfig', 'Paginator'];

    function FlickrService ($http, myConfig, Paginator) {
        return { search };

        function search (searchText, page) {
            var params = {
                api_key: myConfig.API_KEY,
                per_page: myConfig.perPage,
                safe_search: myConfig.one,
                privacy_filter: myConfig.one,
                format: 'json',
                nojsoncallback: myConfig.one,
                text: searchText || 'top rated',
                sort: 'relevance',
                page: page && page > myConfig.zero ? page : myConfig.one,
                method: 'flickr.photos.search'
            };

            return $http({ method: 'GET', url: myConfig.base_url, params })
                .then(res => {
                    var currPage = res.data.photos.page,
                        allPages = res.data.photos.pages;

                    res.data.pageNav = Paginator.paginate(currPage, allPages);

                    return res.data;
                });
        }
    }
}());

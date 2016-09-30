(function () {
    angular.module('picFlickr')
        .factory('GoogleService', GoogleService);

    GoogleService.$inject = ['$http', 'myConfig'];

    function GoogleService ($http, myConfig) {
        return { search };

        function search (searchText, page) {
            var startIndex = page ? (page - myConfig.one) * myConfig.ten : myConfig.one,
                params = {
                    q: searchText,
                    key: myConfig.google_API_KEY,
                    cx: myConfig.search_engine_id,
                    imgSize: 'large',
                    safe: 'medium',
                    searchType: 'image',
                    start: startIndex
                };

            return $http({ method: 'GET', url: myConfig.google_url, params })
                .then(res => res.data);
        }
    }
}());

(function () {
    angular.module('picFlickr')
        .factory('GoogleService', GoogleService);

    GoogleService.$inject = ['$http', 'myConfig', 'Paginator'];

    function GoogleService ($http, myConfig, Paginator) {
        return { search };

        function search (searchText, page) {
            var startIndex = page ? (page - myConfig.one) * myConfig.ten + myConfig.one : myConfig.one,
                params = {
                    q: searchText,
                    key: myConfig.google_API_KEY,
                    cx: myConfig.search_engine_id,
                    imgSize: 'large',
                    fileType: 'jpeg',
                    safe: 'medium',
                    searchType: 'image',
                    start: startIndex
                };

            return $http({ method: 'GET', url: myConfig.google_url, params })
                .then(res => {
                    var request = res.data.queries.request[0];

                    res.data.currPage = Math.floor(request.startIndex / myConfig.ten) + myConfig.one;
                    res.data.allPages = request.totalResults % myConfig.ten === myConfig.zero ? request.totalResults / myConfig.ten
                        : Math.floor(request.totalResults / myConfig.ten) + myConfig.one;
                    res.data.pageNav = Paginator.paginate(res.data.currPage, res.data.allPages);

                    return res.data;
                });
        }

        // function paginator (currPage, allPages) {
        //     var pageNav = [],
        //         i;

        //     if (currPage > myConfig.one) pageNav.push({text: '<< Back', number: currPage - myConfig.one});

        //     for (i = myConfig.one; i <= allPages; i++)
        //         if (i === currPage)
        //             pageNav.push({text: currPage, number: currPage, disabled: true});
        //         else
        //             if (i >= currPage - myConfig.three && i <= currPage + myConfig.three)
        //                 pageNav.push({text: i, number: i});

        //     if (currPage < allPages)
        //         pageNav.push({text: 'Next >>', number: currPage + myConfig.one});

        //     return pageNav;
        // }
    }
}());

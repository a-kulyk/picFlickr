(function () {
    angular.module('picFlickr')
        .factory('Paginator', Paginator);

    Paginator.$inject = ['myConfig'];

    function Paginator (myConfig) {
        return { paginate };

        function paginate (currPage, allPages) {
            var pageNav = [],
                i;

            if (currPage > myConfig.one) pageNav.push({ text: '<< Back', number: currPage - myConfig.one });

            for (i = myConfig.one; i <= allPages; i++)
                if (i === currPage)
                    pageNav.push({ text: currPage, number: currPage, disabled: true });
                else
            if (i >= currPage - myConfig.three && i <= currPage + myConfig.three)
                pageNav.push({ text: i, number: i });

            if (currPage < allPages)
                pageNav.push({ text: 'Next >>', number: currPage + myConfig.one });

            return pageNav;
        }
    }
}());

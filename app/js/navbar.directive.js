(function () {
    angular.module('picFlickr')
        .directive('navbar', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/navbar.html',
                replace: true,
                scope: {
                    search: '&mySearch',
                    googleSearch: '&myGoogleSearch'
                }
            };
        });
}());

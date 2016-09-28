(function () {
    angular.module('picFickr')

        .factory('ngClipboard', ngClipboard);

    ngClipboard.$inject = ['$compile', '$rootScope', '$document', 'myConfig'];

    function ngClipboard ($compile, $rootScope, $document, myConfig) {
        return {toClipboard};
        function toClipboard (element) {
            var copyElement, body, ngClipboardElement, range;

            copyElement = angular.element('<span id="ngClipboardCopyId">' + element + '</span>');
            body = $document.find('body').eq(myConfig.zero);

            body.append($compile(copyElement)($rootScope));

            ngClipboardElement = angular.element(document.getElementById('ngClipboardCopyId'));
            range = document.createRange();

            range.selectNode(ngClipboardElement[myConfig.zero]);

            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            document.execCommand('copy');

            window.getSelection().removeAllRanges();

            copyElement.remove();
        }
    }
}());


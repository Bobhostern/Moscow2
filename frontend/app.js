

var moscow = angular.module('moscow', [ 'ui.materialize', 'ui.router']);
moscow.filter("trust", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);
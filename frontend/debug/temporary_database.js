var moscow = angular.module('moscow');

var rootScope;

moscow.run(function($rootScope){
    rootScope=$rootScope;
    Resource.setScope(rootScope);
});


function xhr(proto, url, cb) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            cb(xhttp.responseText);
        }
    }
    xhttp.open(proto, url, true);
    xhttp.send();
}




var navigationInfo = new NavInfo();
moscow.factory('navinfo', function () {
    return navigationInfo;
});

var userInfo = new UserInfo();
moscow.factory('userinfo', function () {
    return userInfo;
});

var contestInfo = new ContestInfo();
moscow.factory('contestinfo', function () {
    return contestInfo;
});

var messageInfo = new MessageInfo();
moscow.factory('msginfo', function () {
    return messageInfo;
});

var problemInfo = new ProblemInfo();
moscow.factory('probleminfo', function () {
    return problemInfo;
});

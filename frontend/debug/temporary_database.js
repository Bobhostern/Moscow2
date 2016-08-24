var moscow = angular.module('moscow');

var rootScope;

moscow.run(function($rootScope){
    rootScope=$rootScope;
    Resource.setScope(rootScope);
});

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

var submissionInfo = new SubmissionInfo();
moscow.factory('subinfo', function(){
    return submissionInfo;
});
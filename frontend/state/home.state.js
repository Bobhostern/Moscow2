var homecontroller = function ($scope, userinfo) {
    $scope.userinfo = userinfo;

    $scope.updateMembers = function () {
        var members = [];
        for (var x = 0; x < userinfo.members.value().length; x++) {
            members[x] = userinfo.members.value()[x].name;
        }
        xhr('post', '/rest/user/setMembers', function (res) {
            res = JSON.parse(res);
            console.log('leggo');
            resetFormElement($('mainfile'));
        }, 'members=' + encodeURIComponent(JSON.stringify(members)));
    }
};
CONTROLLER_POOL['homecontroller'] = homecontroller;
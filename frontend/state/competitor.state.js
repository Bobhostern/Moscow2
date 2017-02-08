var competitorcontroller = function ($scope, userinfo) {
    $scope.userinfo = userinfo;
    userinfo.competitors.value(function (val) {
        $scope.comp = userinfo.competitors.value()[0];
    });
    $scope.updateScore = function (comp) {

        xhr('put', '/rest/competitors/'+comp.competitor_id+'/writtenscore', function (res) {
            res = JSON.parse(res);
            console.log('leggo');
            resetFormElement($('mainfile'));
        }, 'value=' + encodeURIComponent(comp.writtenscore));
    }
};

CONTROLLER_POOL['competitorcontroller'] = competitorcontroller;
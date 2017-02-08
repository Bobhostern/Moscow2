const UNCOMPILED = -1, UNJUDGED = 0, CORRECT = 1, INCORRECT = 2;

var judgecontroller = function ($scope, probleminfo, subinfo, userinfo) {
    $scope.pinfo = probleminfo;
    $scope.subinfo = subinfo;
    $scope.uinfo = userinfo;
    $scope.color = function (sub) {
        if (sub.status.value() == UNJUDGED) {
            return 'unjudged';
        } else if (sub.status.value() == CORRECT) {
            return 'correct';
        } else if (sub.status.value() == INCORRECT) {
            return 'incorrect';
        } else if (sub.status.value() == UNCOMPILED) {
            return 'not_compiled';
        }
        else {
            return 'loading';
        }
    }
    $scope.s = function (name) {
        return subinfo.getSubmission(name);
    }
    $scope.hasJudge = function () {
        return userinfo.type.value() > 0;
    }
    var subs = subinfo.subids.value();
    // console.log(subs);
    $scope.currentSubmission = subinfo.getSubmission(subs[0]);

    $scope.submitJudgement = function (id) {

        var judgement = elem("judgeselect").options[elem("judgeselect").selectedIndex].dataset.judgement;

        xhr('PUT', '/rest/submission/' + id + '/status', function (res) {
            res = JSON.parse(res);
            if (res.success) {
                $scope.$apply(function () {
                    subinfo.getSubmission(id).status.needsUpdate = true;
                });
            }
        }, 'value=' + encodeURIComponent(judgement));
    }

    $scope.splitLines = function (str) {
        if (str == undefined) {
            str = "";
        }
        var spl = str.split(/\r?\n/);
        return spl;
    }
}

CONTROLLER_POOL['judgecontroller'] = judgecontroller;
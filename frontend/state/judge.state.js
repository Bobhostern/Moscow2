const UNJUDGED = 0, CORRECT = 1, INCORRECT = 2;

var judgecontroller = function($scope, probleminfo, subinfo){
    $scope.pinfo = probleminfo;
    $scope.subinfo = subinfo;
    $scope.color = function(sub){
        if(sub.status.value()==UNJUDGED){
            return 'unjudged';
        } else if(sub.status.value() == CORRECT){
            return 'correct';
        } else if(sub.status.value() == INCORRECT){
            return 'incorrect';
        } else{
            return 'loading';
        }
    }
    var subs = subinfo.subids.value();
    // console.log(subs);
    $scope.currentSubmission = subinfo.getSubmission(subs[0]);
}

CONTROLLER_POOL['judgecontroller'] = judgecontroller;
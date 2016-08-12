var problemscontroller = function ($scope, probleminfo) {

    $scope.probleminfo = probleminfo;
    $scope.currentProblem = probleminfo.problems[0];
};

CONTROLLER_POOL['problemscontroller'] = problemscontroller;


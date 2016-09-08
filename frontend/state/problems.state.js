var problemscontroller = function ($scope, probleminfo) {

    $scope.probleminfo = probleminfo;
    $scope.currentProblem = probleminfo.problems[0];
    $scope.submitProblem = function (filetext) {

        var file = elem('mainfile').files[0];;
        var filename = file.name;

        var reader = new FileReader();
        reader.onload = function () {
            var filetext = reader.result;
            var problem = $scope.currentProblem.id;
            var fn = encodeURIComponent(filename);
            var ft = encodeURIComponent(filetext);
            var p = encodeURIComponent(problem);
            // console.log(problem);
            // console.log(filename);
            // console.log(filetext);
            xhr('post','/rest/submission/submit',function(res){

            },'filetext='+ft+'&filename='+fn+'&problem='+p);
        };

        reader.readAsText(file);
    }
};

CONTROLLER_POOL['problemscontroller'] = problemscontroller;

function elem(id) {
    return document.getElementById(id);
}
var problemscontroller = function ($scope, probleminfo, subinfo) {

    $scope.probleminfo = probleminfo;
    $scope.subinfo = subinfo;
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
                res = JSON.parse(res);
                console.log('leggo');
                resetFormElement($('mainfile'));
            },'filetext='+ft+'&filename='+fn+'&problem='+p);
        };

        reader.readAsText(file);
    }
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
};

CONTROLLER_POOL['problemscontroller'] = problemscontroller;

function elem(id) {
    return document.getElementById(id);
}

function resetFormElement(e) {
   e.wrap('<form>').parent('form').trigger('reset');
    e.unwrap();
}
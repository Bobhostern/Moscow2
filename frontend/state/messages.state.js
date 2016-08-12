var messagescontroller = function ($scope, msginfo, $stateParams, $state) {
    $scope.msginfo = msginfo;
    // $scope.currentMessage;
    var dex = $stateParams.currentMessage;
    var mlist = msginfo.messageids.value();

    if (dex && msginfo.getMessage(dex)) {
        $scope.currentMessage = msginfo.getMessage(dex).value();
    } else {
        $scope.currentMessage = msginfo.getMessage(mlist[0]);
        // console.log($scope.currentMessage);
        // $stateParams.currentMessage = 0;
    }

};

CONTROLLER_POOL['messagescontroller'] = messagescontroller;


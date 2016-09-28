var moscow = angular.module('moscow');

//Grace Rules!

var CONTROLLER_POOL = {}


var state;
var initurl;
moscow.
    component('navigation', {

        templateUrl: 'partial/partial-navigation.html',
        controller: function NavigationController($scope, userinfo, contestinfo, $state, navinfo, msginfo) {
            $scope.userinfo = userinfo;
            $scope.contestinfo = contestinfo;

            $scope.navinfo = navinfo;
            $scope.msginfo = msginfo;
            state = $state;
            var cur = window.location.href;
            initurl = cur.substring(cur.indexOf('#') + 1);

            var countdown;

            var timer = document.createElement('script');
            timer.src = 'angular/timer.js';
            timer.onload = function () {
                countdown = new Timer({
                    ontick: function (ms) {
                        $scope.$apply(function () {
                            contestinfo.contestStatus.val = Math.round(ms / 1000);
                        });
                        if (contestinfo.contestStatus.value() == 1) {
                            setTimeout(function () { $scope.$apply(function () { contestinfo.contestStatus.val = 0 }) }, 1000)
                        }
                        // console.log(contestinfo.contestStatus)
                    }
                });
                contestinfo.countdown.setCount(countdown);
                // countdown.start(contestinfo.contestStatus.value());

            };
            document.head.appendChild(timer);

        }

    });



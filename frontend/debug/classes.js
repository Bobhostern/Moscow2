const NORMAL_REST = '/rest';
const TEST_REST = '/testrest';
const REST = NORMAL_REST;


function xhr(proto, url, cb, data) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            cb(xhttp.responseText);
        }
    }

    xhttp.open(proto, url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(data ? data : '');

}

var resources = [];

function update(url) {
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].url == url) {
            // resources[i].needsUpdate = true;
            resources[i].update();
            return;
        }
    }
}

class Resource {
    constructor(url, proto) {
        var self = this;
        resources.push(self);
        this.url = url;
        this.proto = proto;
        this.isGet = false;
        this.needsUpdate = true;
        this.value = function (cb) {
            if (self.needsUpdate && !self.isGet) {
                self.isGet = true;
                xhr(self.proto, self.url, function (res) {
                    var apply = function () {
                        self.val = JSON.parse(res);
                        self.needsUpdate = false;
                        if (cb) {
                            cb(self.val);
                        }
                    }
                    if (Resource.scope) {
                        Resource.scope.$apply(apply);
                    } else {
                        apply();
                    }
                    self.isGet = false;
                });
            }
            return self.val;
        }
        this.update = function () {
            self.needsUpdate = true;
        }
    }
}
Resource.setScope = function (scope) {
    Resource.scope = scope;
}

es = new EventSource('/sse');

//todo: write event listener for more specific things so less load? :)
es.addEventListener('update', function (e) {
    update(e.data);
});

es.addEventListener('unauthorized', function (e) {
    window.location.href = e.data;
})


function get(url) {
    return new Resource(url, 'GET');
}
function post(url) {
    return new Resource(url, 'POST');
}

class Problem {

    constructor(id) {
        this.id = id;
        var pre = REST + '/problems/' + id + '/';
        this.pointvalue = get(pre + 'pointvalue');
        this.inputname = get(pre + 'inputname');
        this.outputname = get(pre + 'outputname');
        this.samplein = get(pre + 'samplein');
        this.sampleout = get(pre + 'sampleout');
        this.description = get(pre + 'description');
        this.judgein = get(pre + 'judgein');
        this.judgeout = get(pre + 'judgeout');
        this.descin = get(pre + 'descin');
        this.descout = get(pre + 'descout');
        this.name = get(pre + 'name');
    }

}

class ProblemInfo {
    constructor() {
        var self = this;
        this.problemids = get(REST + '/problems/problemlist');
        this.problems = [];
        this.problemids.value(function (val) {
            for (var key in val) {
                self.problems[key] = new Problem(key);
            }
        });
        this.getProblem = function (id) {
            if (this.problems[id]) {
                return this.problems[id];
            }
            return this.problems[id] = new Problem(id);
        }
    }
}

class Message {
    constructor(id) {
        this.id = id;
        var pre = REST + '/messages/' + id + '/';
        this.title = get(pre + 'title');
        this.preview = get(pre + 'preview');
        this.body = get(pre + 'body');
    }
}

class MessageInfo {
    constructor() {
        this.messageids = get(REST + '/messages/messagelist');
        this.messages = [];
        var self = this;
        this.messageids.value(function (val) {
            for (var key in val) {
                self.messages[key] = new Message(key);
            }
        });
        this.getMessage = function (id) {
            if (this.messages[id]) {
                return this.messages[id];
            }
            return this.messages[id] = new Message(id);
        }
    }
}

function fancytime(copy) {
    var ret = '';
    // var copy = cinfo.contestStatus;
    if (Math.floor(copy / (60 * 60)) > 0) {
        var hours = Math.floor(copy / (60 * 60));
        ret += hours + ':';
        copy %= (60 * 60);

        if (Math.floor(copy / 60) > 0) {
            var mins = Math.floor(copy / 60);
            if (mins < 10) {
                ret += '0';
            }
            ret += mins + ':';
            copy %= 60;
        } else {
            ret += '00:';
        }
        var b = false;
        if (ret == '') {
            b = true;
        }
        if (copy < 10 && !b) {
            ret += '0';
        }
        ret += copy;
        if (b) {
            ret += ' seconds';
        }
        return ret;
    }
    if (Math.floor(copy / 60) > 0) {
        var mins = Math.floor(copy / 60);
        ret += mins + ':';
        copy %= 60;
    }
    var b = false;
    if (ret == '') {
        b = true;
    }
    if (copy < 10 && !b) {
        ret += '0';
    }
    ret += copy;
    if (b) {
        ret += ' seconds';
    }
    return ret;

}

class Countdown {
    constructor(cinf) {
        var self = this;
        this.isTry = false;
        this.cinf = cinf;
        this.tryCount = function () {
            if (cinf.contestStatus.value() > 0) {
                self.isTry = true;
            }
            if (self.count) {
                self.isTry = false;
                count.start(cinf.contestStatus.value());
            }
        }
        this.setCount = function (count) {
            self.count = count;
            if (self.isTry) {
                self.isTry = false;
                count.start(cinf.contestStatus.value());
            }
        }
    }
}

class ContestInfo {
    constructor() {
        var self = this;

        this.countdown = new Countdown(self);
        this.contestStatus = get(REST + '/contest/status');
        this.contestStatus.value(function () {
            self.countdown.tryCount();
        });
        this.contestName = get(REST + '/contest/name');
        this.remaining = function () {
            return fancytime(self.contestStatus.value());
        }
    }
}

class UserInfo {
    constructor() {
        this.username = get(REST + '/user/username');
        this.alias = get(REST + '/user/alias');
        this.propic = get(REST + '/user/propic');
        //0 = competitor, 1 = judge, 2 = admin, -1 = not logged in
        this.type = get(REST + '/user/type');
        this.token = getCookie('token') ? getCookie('token') : "I have no token :(";
        this.isLoggedIn = get(REST + '/user/isLoggedIn');
    }
}

class ContestDropdown {
    constructor(id) {
        this.id = id;
        var pre = REST + '/navigation/contestdropdowns/' + id + '/';
        this.clazz = get(pre + 'clazz');
        this.content = get(pre + 'content');
    }
}

class UserDropdown {
    constructor(id) {
        this.id = id;
        var pre = REST + '/navigation/userdropdowns/' + id + '/';
        this.clazz = get(pre + 'clazz');
        this.content = get(pre + 'content');
    }
}

class NavPage {
    constructor(id) {
        var self = this;
        this.id = id;
        var pre = REST + '/navigation/navigationpages/' + id + '/';
        this.name = get(pre + 'name');
        this.title = get(pre + 'title');
        this.url = get(pre + 'url');
        this.templateUrl = get(pre + 'templateUrl');
        this.controllerUrl = get(pre + 'controllerUrl');
        this.controller = get(pre + 'controller');
        this.loadAll = function (cb) {
            var li = []
            var num = 0;
            for (var key in self) {
                if (self[key].value) {
                    li.push(self[key]);
                }
            }
            num = li.length;
            console.log(li[0]);
            while (li.length > 0) {
                li.pop().value(function () {
                    num--;
                    if (num == 0) {
                        cb();
                    }
                });
            }
        }
    }
}
var stateProvider;
moscow.config(function ($stateProvider) {
    stateProvider = $stateProvider;
})
var remainingModules = 0;
function gen(page, $stateProvider) {
    return function () {
        $stateProvider.state(page.name.value(), {
            url: page.url.value(),
            templateUrl: page.templateUrl.value(),
            controller: CONTROLLER_POOL[page.controller.value()]
        });
        remainingModules--;
        // console.log(page.url.value() + ' ' + initurl);
        if (page.url.value() === initurl) {
            state.go(page.name.value());
            remainingModules = -1;
        }
        else if (remainingModules == 0) {
            state.go('home');
        }
    }
}

function navAdd(page) {
    remainingModules++;
    page.loadAll(function () {
        for (var v in page) {
            if (page[v].value) {
                page[v].value();
            }
        }
        var elem = document.createElement("script");
        elem.src = page.controllerUrl.value();
        elem.onload = gen(page, stateProvider);
        document.head.appendChild(elem);
    })
}

class NavInfo {
    constructor() {
        this.cdropids = get(REST + '/navigation/cdroplist');
        this.udropids = get(REST + '/navigation/udroplist');
        this.npageids = get(REST + '/navigation/npagelist');
        this.cdrop = [];
        this.udrop = [];
        this.npage = [];
        var self = this;
        this.cdropids.value(function (val) {
            for (var key in val) {
                self.cdrop[key] = new ContestDropdown(key);
            }
        });
        this.udropids.value(function (val) {
            for (var key in val) {
                self.udrop[key] = new UserDropdown(key);
            }
        });
        this.npageids.value(function (val) {
            for (var key in val) {
                navAdd(self.npage[key] = new NavPage(key));
            }

        });
    }
}

class Submission {
    constructor(id) {
        this.id = id;

        var pre = REST + '/submission/' + id + '/';
        //0 = unjudged, 1 = correct, 2 = incorrect
        this.status = get(pre + 'status');
        this.problem = get(pre + 'problem_id');
        this.output = get(pre + 'output');
        this.team = get(pre + 'user_id');
        this.source = get(pre + 'source');
        this.filename = get(pre + 'filename');

    }
}

class SubmissionInfo {
    constructor() {
        this.subids = get(REST + '/submission/sublist');
        this.subs = [];
        var self = this;

        var populate = function (val) {
            for (var i = 0; i < val.length; i++) {
                var id = val[i];
                self.subs[i] = new Submission(id);
            }
        };

        this.subids.update = function () {
            self.subids.needsUpdate = true;
            self.subids.value(populate);
        }

        this.subids.value(populate);
        this.getSubmission = function (id) {
            if (this.subs[id]) {
                return this.subs[id];
            }
            return this.subs[id] = new Submission(id);
        }
        this.submissionOptions = [
            {
                name: 'Not Compiled',
                num: -1
            },
            {
                name: 'Unjudged',
                num: 0
            },
            {
                name: 'Correct',
                num: 1
            },
            {
                name: 'Incorrect',
                num: 2
            }
        ]

    }
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
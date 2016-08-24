function xhr(proto, url, cb) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            cb(xhttp.responseText);
        }
    }
    xhttp.open(proto, url, true);
    xhttp.send();
}
class Resource {
    constructor(url, proto) {
        var self = this;
        this.url = url;
        this.proto = proto;
        this.isGet = false;
        this.value = function (cb) {
            if (self.val == null && !self.isGet) {
                self.isGet = true;
                xhr(self.proto, self.url, function (res) {
                    var apply = function () {
                        self.val = JSON.parse(res);
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
    }
}
Resource.setScope = function (scope) {
    Resource.scope = scope;
}

function get(url) {
    return new Resource(url, 'GET');
}
function post(url) {
    return new Resource(url, 'POST');
}

class Problem {

    constructor(id) {
        this.id = id;
        var pre = '/rest/problems/' + id + '/';
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
        this.problemids = get('/rest/problems/problemlist');
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
        var pre = '/rest/messages/' + id + '/';
        this.title = get(pre + 'title');
        this.preview = get(pre + 'preview');
        this.body = get(pre + 'body');
    }
}

class MessageInfo {
    constructor() {
        this.messageids = get('/rest/messages/messagelist');
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
        this.contestStatus = get('/rest/contest/status');
        this.contestStatus.value(function () {
            self.countdown.tryCount();
        });
        this.contestName = get('/rest/contest/name');
        this.remaining = function () {
            return fancytime(self.contestStatus.value());
        }
    }
}

class UserInfo {
    constructor() {
        this.username = get('/rest/user/username');
        this.alias = get('/rest/user/alias');
        this.propic = get('/rest/user/propic');
    }
}

class ContestDropdown {
    constructor(id) {
        this.id = id;
        var pre = '/rest/navigation/contestdropdowns/' + id + '/';
        this.clazz = get(pre + 'clazz');
        this.content = get(pre + 'content');
    }
}

class UserDropdown {
    constructor(id) {
        this.id = id;
        var pre = '/rest/navigation/userdropdowns/' + id + '/';
        this.clazz = get(pre + 'clazz');
        this.content = get(pre + 'content');
    }
}

class NavPage {
    constructor(id) {
        var self = this;
        this.id = id;
        var pre = '/rest/navigation/navigationpages/' + id + '/';
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
        this.cdropids = get('/rest/navigation/cdroplist');
        this.udropids = get('/rest/navigation/udroplist');
        this.npageids = get('/rest/navigation/npagelist');
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

        var pre = '/rest/submission/'+id+'/';
        //0 = unjudged, 1 = correct, 2 = incorrect
        this.status = get(pre+'status');
        this.problem = get(pre+'problem');
        this.output = get(pre+'output');
        this.team = get(pre+'team');
        this.sourceFile = get(pre+'sourceFile');

    }
}

class SubmissionInfo {
    constructor() {
        this.subids = get('/rest/submission/sublist');
        this.subs = [];
        var self = this;
        this.subids.value(function(val){
            for(var key in val){
                self.subs[key] = new Submission(key);
            }
        });
        this.getSubmission = function (id) {
            if (this.subs[id]) {
                return this.subs[id];
            }
            return this.subs[id] = new Submission(id);
        }
        this.submissionOptions = [
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

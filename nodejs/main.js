//add sql database config
const db_config = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'moscow'
};
//pick a strong secret!
const secret = "don't guess me!";






var mysql = require('mysql');
var connection;
function handleDisconnect() {
    console.log("connecting to database");
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
        dbmanager.init(connection);
    });

    connection.query("use moscow;", function (err, rows) { });          // the old one cannot be reused.


    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

var dbmanager = require('./dbmanager');



var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');

app.use(urlencodedParser);
app.use(cookieParser());

var connections = [];

var RABBIT_ADDRESS = 'amqp://localhost';

var amqp = require('amqplib/callback_api');
var WORK_QUEUE = 'WORK_QUEUE';
var channel;
amqp.connect(RABBIT_ADDRESS, function(err,conn){
    conn.createChannel(function(err,ch){
        channel = ch;
        ch.assertQueue(WORK_QUEUE, {durable:true});
    });
});

app.use('*', function (req, res, next) {
    // console.log(req.protocol + " " + req.method + " request from " + req.ip + " for " + req.baseUrl);
    req.connection = connection;
    res.stringify = function (val) {
        res.end(JSON.stringify(val));
    }
    req.sse = function (url) {
        console.log('sse ' + url);
        for (var i = 0; i < connections.length; i++) {
            connections[i].send({
                event: 'update',
                data: url
            });
        }
    }
    req.channel = channel;
    req.WORK_QUEUE = WORK_QUEUE;
    next();
}
);


console.log(__dirname);

var path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));


var jwt = require('express-jwt');
app.use(jwt({    
     secret: secret,
     credentialsRequired: true,
    getToken: function(req){
        var cookie = req.headers.cookie;
        if (!cookie) {
            return null;
        }
        var token = getCookie(cookie, 'token');
        if (!token) {
            return null;
        }
        return token;
  
    }}).unless({ path: ['/rest/login','/rest/user/isLoggedIn','/favicon.ico','/rest/worker/submitJudgement'] }));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // console.log('denied ' + req.url);
        res.status(404).end('404 Not Found. Requested resource does not exist or you do not have permission to view it.');
    }
});


var bcrypt = require('bcrypt-nodejs');
var jsonwebtoken = require('jsonwebtoken');

app.post('/rest/login', urlencodedParser, function (req, res) {

    res.fail = function(){
        res.redirect('/login.html?failure=true');
    };
    res.pass = function(){
        res.redirect('/');
    }

    var connection = req.connection;
    if(!req.body){
        res.fail();
        return;
    }
    var user = connection.escape(req.body.username);
    var pass = req.body.password;
    if(!user || !pass){
       res.fail();
       return;
    }
    // console.log(req.body);
    connection.q('select * from user where username = ' + user + ';', res, function (rows) {
        if(!rows[0]){
            res.fail();
            return;
        }
        var hash = rows[0].password;
        bcrypt.compare(pass, hash, function (err, valid) {
            if (err) {
                console.log('bcrypt error: ' + JSON.stringify(err));
                res.fail();
                return;
            }
            if (valid) {
                var token = {
                    type: rows[0].type,
                    username: rows[0].username,
                    id: rows[0].user_id
                };

                var signed = jsonwebtoken.sign(token, secret);

                res.cookie('token',signed).redirect('/');

                // res.end(JSON.stringify({
                //     success: true,
                //     token: signed
                // }));


            } else {
                res.fail();
            }
        });

    });

});


var router = require('./routes/router');

router(app);

var server = app.listen(80, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Moscow app listening at http://%s:%s", host, port);

});

var SSE = require('sse');

var sse = new SSE(server);

sse.on('connection', function (conn) {

    // var token = conn.req.cookies.token;
    var cookie = conn.req.headers.cookie;

    if (!cookie) {
        conn.send({
            event: 'unauthorized',
            data: '/login.html'
        });
        conn.close();
        return;
    }
    var token = getCookie(cookie, 'token');
    if (!token) {
        conn.send({
            event: 'unauthorized',
            data: '/login.html'
        });
        conn.close();
        return;
    }

    jsonwebtoken.verify(token, secret, function (err, payload) {

        if (err) {
            conn.send({
            event: 'unauthorized',
            data: '/login.html'
        });
            conn.close();
            return;
        }

        // console.log("user joined realtime updates");

        connections.push(conn);

        conn.on('close', function () {
            // console.log('user disconnected');
            for (var i = 0; i < connections.length; i++) {
                if (connections[i] == conn) {
                    connections.splice(i, 1);
                }
            }
        });
    });


});

function getCookie(cookie, cname) {
    // console.log(document.cookie);
    var name = cname + "=";
    var ca = cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
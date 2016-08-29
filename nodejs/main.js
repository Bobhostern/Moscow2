var mysql = require('mysql');
var db_config = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'moscow'
};
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

app.use('*', function (req, res, next) {
    console.log(req.protocol + " " + req.method + " request from " + req.ip + " for " + req.baseUrl);
    req.connection = connection;
    res.stringify = function(val){
        res.end(JSON.stringify(val));
    }
    next();
}
);

console.log(__dirname);

var path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

var jwt = require('express-jwt');
const secret = "don't guess me!";
app.use(jwt({ secret: secret, credentialsRequired: false }));

var router = require('./routes/router');

router(app);

var server = app.listen(80, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Moscow app listening at http://%s:%s", host, port);

});
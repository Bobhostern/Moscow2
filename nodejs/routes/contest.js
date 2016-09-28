var express = require('express');

var router = express.Router();

//everyone can access
router.get('/name', function (req, res) {
    var necessary = -1;      //evverryyonneeeeee
    var type = req.user.type;
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    req.connection.q('select name from meta', res, function (rows) {
        res.stringify(rows[0].name);
    });
});

//administrators only
router.put('/name', function (req, res) {
    var necessary = 2;      //administrator only
    var type = req.user.type;
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    var name = req.body.name;
    if(!name){
        res.status(400).end();
        return;
    }
    req.connection.q('update meta set name='+connection.escape(name)+';', res, function(rows){
        res.end(JSON.stringify({success: true,result: val}));
        req.sse('/contest/name');
    });
});

//everyone
router.get('/status', function (req, res) {
    var necessary = -1;      //evverryyonneeeeee
    var type = req.user.type;
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    req.connection.q('select status from meta', res, function (rows) {
        res.stringify(rows[0].status);
    })
});

//administrators only
router.put('/status', function (req, res) {
    var necessary = 2;      //administrator only
    var type = req.user.type;
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    var status = req.body.status;
    if(!name){
        res.status(400).end();
        return;
    }
    req.connection.q('update meta set status='+connection.escape(status)+';',res, function(rows){
        res.end(JSON.stringify({success: true,result: val}));
        req.sse('/contest/status');
    });
});


module.exports = router;
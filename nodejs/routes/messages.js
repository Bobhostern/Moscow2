var express = require('express');

var router = express.Router();

//competitor and higher
router.get('/messagelist', function (req, res) {
    var necessary = 0;      //competitor and higher
    var type = req.user.type;
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    req.connection.qlist('message', 'msg_id', res);
});

//competitor and higher
router.get('/:id/:prop', function (req, res) {
    var necessary = 0;      //competitor and higher
    var type = req.user.type;
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    req.connection.qprop('message', req.params.prop, 'msg_id', req.params.id, res);
});

//administrators only
router.put('/:id/:prop', function (req, res) {
    var necessary = 2;      //administrators
    var type = req.user.type;
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    var val = req.connection.escape(req.body.value);

    req.connection.q('update message set `' + prop + '`=' + val + ' where msg_id=' + id + ';', res, function (rows) {
        res.end(JSON.stringify({success:true}));
        req.sse('/rest/messages/'+req.params.id+'/'+req.params.prop);

    });
});

//administrators only
router.post('/send', function (req, res) {
    var type = req.user.type;
    var necessary = 2;      //administrators
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    var body = req.connection.escape(req.body.body);
    var preview = req.connection.escape(req.body.preview ? req.body.preview : 'no preview');
    var title = req.connection.escape(req.body.title);

    if (!title || !preview || !body) {
        res.end(JSON.stringify({ success: false }));
        return;
    }

    req.connection.q('insert into message (body,preview,title) values (' + body + ',' + preview + ',' + title + ');', res, function(rows){
        res.end(JSON.stringify({success:true}));
        req.sse('/rest/messages/messagelist');
    });
});


module.exports = router;
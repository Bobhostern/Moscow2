var express = require('express');

var router = express.Router();



//available to competitors and higher, but competitors can only see their own submissions
router.get('/sublist', function (req, res) {

    var id = req.user.id;

    var type = req.user.type;
    var necessary = 0;      //competitor and up
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    if (type > 0) {
        req.connection.q('select sub_id from submission;', res, function (rows) {
            var arr = [];
            for (var i = 0; i < rows.length; i++) {
                arr[i] = rows[i].sub_id;
            }
            res.stringify(arr);
        });
    } else {
        req.connection.q('select sub_id from submission where user_id = ' + id, res, function (rows) {
            var arr = [];
            for (var i = 0; i < rows.length; i++) {
                arr[i] = rows[i].sub_id;
            }
            res.stringify(arr);
        });
    }
});

//available to competitors and higher, but competitors cannot access output property
router.get('/:id/:prop', function (req, res) {
    
    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);

    var userid = req.user.id;
    var type = req.user.type;

    if(type < 1 && prop.includes('output')){
        res.status(403).end();
        return;
    }
    
    prop = prop.substring(1, prop.length - 1);
    req.connection.q('select `' + prop + '` from submission where sub_id = ' + id + ';', res, function (rows) {
        if(rows[0] == undefined){
            res.status(400).end();
            return;
        }
        res.stringify(rows[0][prop]);
    });
});

//available to judges and higher
router.put('/:id/:prop/', function (req, res) {

    var type = req.user.type;
    var necessary = 1;      //judges or greater
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    var val = req.connection.escape(req.body.value);
    req.connection.q('update submission set `' + prop + '`=' + val + ' where sub_id=' + id + ';', res, function (rows) {
        res.end(JSON.stringify({success:true}));
        req.sse('/rest/submission/'+req.params.id+'/'+req.params.prop);
        
    });
});

//available to competitors and higher
router.post('/submit', function (req, res) {
    // console.log(req.body);

    var connection = req.connection;
    var ft = connection.escape(req.body.filetext);
    var fn = connection.escape(req.body.filename);
    var prob = connection.escape(req.body.problem);
    var user = req.user.id;

    var type = req.user.type;
    var necessary = 0;      //competitor and higher
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    connection.q('insert into submission (problem_id, source, filename, user_id) values (' + prob + ', ' + ft + ', ' + fn + ', ' + user + ');', res, function (rows) {
        res.end(JSON.stringify({success:true}));
        req.sse('/rest/submission/sublist');
        connection.q('select sub_id from submission where source = ' + ft + ' and user_id =  ' + user,res,function(rows){
            var id = rows[rows.length-1].sub_id;
            req.channel.sendToQueue(req.WORK_QUEUE, new Buffer(
                JSON.stringify({
                    tag: 'legit_moscow_javacompiler',
                    body: JSON.stringify({
                        filename: req.body.filename,
                        filebody: req.body.filetext,
                        id: id
                })
                })
            ));
        })
    });

});


module.exports = router;
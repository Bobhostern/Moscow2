var express = require('express');

var router = express.Router();


router.get('/sublist', function (req, res) {

    var type = req.connection.escape(1); //replace
    var id = 0;

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

router.get('/:id/:prop', function (req, res) {
    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    req.connection.q('select `' + prop + '` from submission where sub_id = ' + id + ';', res, function (rows) {
        res.stringify(rows[0][prop]);
    });
});
router.put('/:id/:prop/', function (req, res) {
    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    var val = req.connection.escape(req.body.value);
    req.connection.q('update submission set `' + prop + '`=' + val + ' where sub_id=' + id + ';', res, function (rows) {
        res.end(JSON.stringify(
            {
                success: true,
                result: val
            }
        ));
        
    });
});

router.post('/submit', function (req, res) {
    // console.log(req.body);

    var connection = req.connection;
    var ft = connection.escape(req.body.filetext);
    var fn = connection.escape(req.body.filename);
    var prob = connection.escape(req.body.problem);
    var user = connection.escape(0);

    connection.q('insert into submission (problem_id, source, filename, user_id) values (' + prob + ', ' + ft + ', ' + fn + ', ' + user + ');', res, function (rows) {
        res.end('{success:true}');
        req.sse('/rest/submission/sublist');
    });

});


module.exports = router;
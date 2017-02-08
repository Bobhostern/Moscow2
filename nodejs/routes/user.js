var express = require('express');

var router = express.Router();

router.get('/propic', function (req, res) {
    res.stringify('images/kirbyyy.jpg');
});

// router.get('/username', function (req, res) {
//     req.connection.q('select username from user limit 1;', res, function(rows){
//         res.stringify(rows[0].username);
//     });
// });

router.get('/isLoggedIn', function (req, res) {

    var type = req.user.type;
    var necessary = -1;      //all users
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    res.end(JSON.stringify({
        isLoggedIn: true
    }));

});

router.get('/members', function (req, res) {

    var type = req.user.type;
    var necessary = 0;
    if (type != necessary) {
        res.status(403).end();
        return;
    }

    req.connection.q('select * from competitor where user_id = ' + req.user.id + ';', res, function (rows) {
        res.stringify(rows);
    });
})


router.post('/setMembers', function (req, res) {
    console.log(req.body);

    var id = req.user.id;

    var type = req.user.type;
    var necessary = 0;      //competitor and up
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    var members = req.body.members;
    if (!members) {
        res.status(400).end();
        return;
    }
    members = JSON.parse(members);

    req.connection.q('delete from competitor where user_id = ' + id, res, function (rows) {

        for (var x = 0; x < members.length; x++) {
            req.connection.q('insert into competitor (name, user_id) values (' + req.connection.escape(members[x]) + ', ' + id + ');', res, function (rows) {

            });
        }
        res.stringify({ success: true });
    });

});

router.get('/hasMembers', function(req, res){

    req.connection.q('select count(*) from competitor where user_id = '  + req.user.id + ';', res, function(rows){
        res.stringify(rows[0] > 0);
    });
});

router.get('/:prop', function (req, res) {
    var id = req.user.id;

    var type = req.user.type;
    var necessary = 0;      //competitor and up
    if (type < necessary) {
        res.status(403).end();
        return;
    }

    req.connection.qprop('user', req.params.prop, 'user_id', id, res);
});

module.exports = router;
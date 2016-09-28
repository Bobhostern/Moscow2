var express = require('express');

var router = express.Router();

router.get('/propic', function (req, res) {
    res.stringify('images/kirbyyy.jpg');
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

module.exports = router;
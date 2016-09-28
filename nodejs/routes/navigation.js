var express = require('express');

var router = express.Router();

//competitors and higher
router.get('/cdroplist', function (req, res) {
    var type = req.user.type;
    var necessary = 0;      //competitor and higher
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    req.connection.qlist('contestdropdown', 'cdrop_id', res);
});

//all, but differs per group
router.get('/npagelist', function (req, res) {
    var type = req.user.type;
    var necessary = -1;      //all
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    req.connection.q('select npage_id from navigationpage where min_permission <= ' + type,res, function (rows) {
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr[i] = rows[i]['npage_id'];
        }
        res.stringify(arr);
    })
});

//competitor and higher
router.get('/udroplist', function (req, res) {
    var type = req.user.type;
    var necessary = 0;      //competitor and higher
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    req.connection.qlist('userdropdown', 'udrop_id', res);
});

router.get('/contestdropdowns/:id/:prop', function (req, res) {
    req.connection.qprop('contestdropdown', req.params.prop, 'cdrop_id', req.params.id, res);
});
// router.put('/contestdropdowns/:id/:prop', function (req, res) {
//     req.connection.q('', res, function (rows) {

//     });
// });

router.get('/navigationpages/:id/:prop', function (req, res) {
    req.connection.qprop('navigationpage', req.params.prop, 'npage_id', req.params.id, res);
});
// router.put('/navigationpages/:id/:prop', function (req, res) {
//     req.connection.q('', res, function (rows) {

//     });
// });

router.get('/userdropdowns/:id/:prop', function (req, res) {
    req.connection.qprop('userdropdown', req.params.prop, 'udrop_id', req.params.id, res);
});
// router.put('/userdropdowns/:id/:prop', function (req, res) {
//     req.connection.q('', res, function (rows) {

//     });
// });

module.exports = router;
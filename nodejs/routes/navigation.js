var express = require('express');

var router = express.Router();

router.get('/cdroplist', function (req, res) {
    req.connection.qlist('contestdropdown', 'cdrop_id', res);
});
router.get('/npagelist', function (req, res) {
    req.connection.qlist('navigationpage', 'npage_id', res);
});
router.get('/udroplist', function (req, res) {
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
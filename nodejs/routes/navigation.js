var express = require('express');

var router = express.Router();

router.get('/cdroplist', function (req, res) {
    req.connection.q('select cdrop_id from contestdropdown;', res, function (rows) {
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr[i] = rows[i].cdrop_id;
        }
        res.stringify(arr);
    });
});
router.get('/npagelist', function (req, res) {
    req.connection.q('select npage_id from navigationpage;', res, function (rows) {
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr[i] = rows[i].cdrop_id;
        }
        res.stringify(arr);
    });
});
router.get('/udroplist', function (req, res) {
    req.connection.q('select udrop_id from userdropdown;', res, function (rows) {
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr[i] = rows[i].cdrop_id;
        }
        res.stringify(arr);
    });
});

router.get('/contestdropdowns/:id/:prop', function (req, res) {
    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    req.connection.q('select `' + prop + '` from contestdropdown where cdrop_id = ' + id + ';', res, function (rows) {
        res.stringify(rows[0][prop]);
    });
});
// router.put('/contestdropdowns/:id/:prop', function (req, res) {
//     req.connection.q('', res, function (rows) {

//     });
// });

router.get('/navigationpages/:id/:prop', function (req, res) {

    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    req.connection.q('select `' + prop + '` from navigationpage where npage_id = ' + id + ';', res, function (rows) {
        res.stringify(rows[0][prop]);
    });
});
// router.put('/navigationpages/:id/:prop', function (req, res) {
//     req.connection.q('', res, function (rows) {

//     });
// });

router.get('/userdropdowns/:id/:prop', function (req, res) {

    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    req.connection.q('select `' + prop + '` from userdropdown where udrop_id = ' + id + ';', res, function (rows) {
        res.stringify(rows[0][prop]);
    });

});
// router.put('/userdropdowns/:id/:prop', function (req, res) {
//     req.connection.q('', res, function (rows) {

//     });
// });

module.exports = router;
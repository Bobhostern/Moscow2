var express = require('express');

var router = express.Router();

router.get('/problemlist', function (req, res) {
    req.connection.q('select prob_id from problem;', res, function (rows) {
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr[i] = rows[i].prob_id;
        }
        res.stringify(arr);
    });
});

router.get('/:id/:prop', function (req, res) {
    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    req.connection.q('select `' + prop + '` from problem where prob_id = ' + id + ';', res, function (rows) {
        res.stringify(rows[0][prop]);
    });
});
router.put('/:id/:prop', function (req, res) {

});

module.exports = router;
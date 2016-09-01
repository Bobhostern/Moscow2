var express = require('express');

var router = express.Router();


router.get('/name', function (req, res) {
    req.connection.q('select name from meta', res, function (rows) {
        res.stringify(rows[0].name);
    });
});
router.put('/name', function (req, res) {

});

router.get('/status', function (req, res) {
    req.connection.q('select status from meta', res, function (rows) {
        res.stringify(rows[0].status);
    })
});
router.put('/status', function (req, res) {

});


module.exports = router;
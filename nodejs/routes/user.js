var express = require('express');

var router = express.Router();

router.get('/alias', function (req, res) {
    req.connection.q('select alias from user limit 1;', res, function(rows){
        res.stringify(rows[0].alias);
    });
});
router.get('/propic', function (req, res) {
    res.stringify('images/kirbyyy.jpg');
});
router.get('/username', function (req, res) {
    req.connection.q('select username from user limit 1;', res, function(rows){
        res.stringify(rows[0].username);
    });
});
module.exports = router;
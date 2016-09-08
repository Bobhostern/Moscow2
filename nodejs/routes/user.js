var express = require('express');

var router = express.Router();

router.get('/propic', function (req, res) {
    res.stringify('images/kirbyyy.jpg');
});

router.get('/:prop', function (req, res) {
    var id = 0; //replace
   req.connection.qprop('user',req.params.prop,'user_id',id,res);
});
// router.get('/username', function (req, res) {
//     req.connection.q('select username from user limit 1;', res, function(rows){
//         res.stringify(rows[0].username);
//     });
// });
module.exports = router;
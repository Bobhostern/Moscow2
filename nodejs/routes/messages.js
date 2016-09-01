var express = require('express');

var router = express.Router();

router.get('/messagelist', function (req, res) {
    req.connection.qlist('message','msg_id',res);
});

router.get('/:id/:prop', function (req, res) {
    req.connection.qprop('message',req.params.prop,'msg_id',req.params.id,res);
});
router.put('/:id/:prop', function (req, res) {

});


module.exports = router;
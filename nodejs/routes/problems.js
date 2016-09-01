var express = require('express');

var router = express.Router();

router.get('/problemlist', function (req, res) {
    req.connection.qlist('problem','prob_id',res);
});

router.get('/:id/:prop', function (req, res) {
    req.connection.qprop('problem',req.params.prop,'prob_id',req.params.id,res);
});
router.put('/:id/:prop', function (req, res) {

});

module.exports = router;
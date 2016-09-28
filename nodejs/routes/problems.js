var express = require('express');

var router = express.Router();

//available to competitors and higher
router.get('/problemlist', function (req, res) {
    var type = req.user.type;
    var necessary = 0;      //competitor and higher
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    
    req.connection.qlist('problem','prob_id',res);
});

//available to competitors and higher, except
//judgein and judgeout are only available to judges and higher
router.get('/:id/:prop', function (req, res) {

    var type = req.user.type;
    var necessary = 0;      //competitor and higher
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);

    if(type < 1 && (prop.includes('judgein') || prop.includes('judgeout'))){
        res.status(403).end();
        return;
    }


    req.connection.qprop('problem',req.params.prop,'prob_id',req.params.id,res);
});

//available to administrators and higher
router.put('/:id/:prop', function (req, res) {
    var type = req.user.type;
    var necessary = 2;      //administrator and higher
    if (type < necessary) {
        res.status(403).end();
        return;
    };

    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);
    var val = req.connection.escape(req.body.value);

    req.connection.q('update problem set `' + prop + '`=' + val + ' where prob_id=' + id + ';', res, function (rows) {
        res.end(JSON.stringify({success:true}));
        req.sse('/rest/problems/'+req.params.id+'/'+req.params.prop);
        
    });


});

module.exports = router;
var express = require('express');

var router = express.Router();

router.get('/list', function(req, res){
    var type = req.user.type;
    var necessary = 2;      //admin and higher
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    
    req.connection.q('select * from competitor', res, function(rows){
        res.stringify(rows);
    });
});

router.get('/:id/:prop', function(req, res){
    var type = req.user.type;
    var necessary = 0;      //competitor and higher
    if (type < necessary) {
        res.status(403).end();
        return;
    }
    if(req.params.id!=req.user.id && type < 2){
        res.status(403).end();
        return;
    }
    var id = req.connection.escape(req.params.id);
    var prop = req.connection.escape(req.params.prop);
    prop = prop.substring(1, prop.length - 1);


    req.connection.qprop('competitor',req.params.prop,'competitor_id',req.params.id,res);
});

router.put('/:id/:prop', function(req,res){
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

    req.connection.q('update competitor set `' + prop + '`=' + val + ' where competitor_id=' + id + ';', res, function (rows) {
        res.end(JSON.stringify({success:true}));
        req.sse('/rest/competitors/'+req.params.id+'/'+req.params.prop);
        
    });
});

module.exports = router;
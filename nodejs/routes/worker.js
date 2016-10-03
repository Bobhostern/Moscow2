var express = require('express');

var router = express.Router();

router.post('/submitJudgement', function (req, res) {
    console.log(req.body);
    var user = req.user;
    if (1 == 2) {
        res.status(403).end();
        return;
    }

    var connection = req.connection;
    var id = req.body.id;
    var buildOutput = req.body.buildOutput;
    var runOutput = req.body.runOutput;

    if(!id){
        res.end(JSON.stringify({success:false}));
        return;
    }

    id = connection.escape(id);
    buildOutput = connection.escape(buildOutput);
    runOutput = connection.escape(runOutput);

    connection.q('update submission set output = '+runOutput+', status = 0 where sub_id='+id+';', res, function (rows) {
        req.sse('/rest/submission/'+req.body.id+'/status');
        req.sse('/rest/submission/'+req.body.id+'/output');
        res.end(JSON.stringify({success:true}));
    });

});

module.exports = router;
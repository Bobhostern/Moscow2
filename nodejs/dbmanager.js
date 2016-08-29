const CURRENT_VERSION = '0.0.1';

exports.init = function (connection) {

    connection.query('use moscow', function (err) {

        // connection.query('select * from metadata', function (err, rows) {

        //     if(err){

        //     }
        //     var version = rows[0].version;


        // });
    });

    connection.q = function (query, res, cb) {
        connection.query(query, function (err, rows) {
            if(err){
                console.log(err.stack);
                res.end('error');
                return;
            }
            cb(rows);
        });
    };


}
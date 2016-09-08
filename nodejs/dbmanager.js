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
            if (err) {
                console.log(err.stack);
                res.end('{success:false}');
                return;
            }
            cb(rows);
        });
    };

    connection.qprop = function (table, prop, idname, id, res) {
        prop = connection.escape(prop);
        prop = prop.substring(1, prop.length - 1);
        id = connection.escape(id);
        connection.q('select `' + prop + '` from ' + table + ' where `' + idname + '` = ' + id, res, function (rows) {
            try {
                res.stringify(rows[0][prop]);
            } catch (e) {
                console.log(e.stack);
                res.end('{success:false}');
            }
        });
    }

    connection.qlist = function (table, prop, res) {
        prop = connection.escape(prop);
        prop = prop.substring(1, prop.length - 1);
        connection.q('select `' + prop + '` from ' + table + ';', res, function (rows) {
            var arr = [];
            for (var i = 0; i < rows.length; i++) {
                arr[i] = rows[i][prop];
            }
            res.stringify(arr);
        });
    }


}
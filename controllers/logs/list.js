var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// LIST
exports.request = function(req, res) {

    // TODO: Verify authenticated user is admin

    // Check if Header contains Access-Token
    /*if(!req.headers.authorization || req.headers.authorization === ""){
        res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
        return console.error(errors.authentication.error_2.message);
    } else {

        // Verify Access-Token
        jwt.verify(req.headers.authorization, secret.key, function(err, decoded) {
            if (err) {
                res.status(errors.authentication.error_1.code).send(errors.authentication.error_1);
                return console.error(errors.authentication.error_1.message);
            } else {*/


                var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

                pg.connect(url, function(err, client, done) {
                    if (err) {
                        res.status(errors.database.error_1.code).send(errors.database.error_1);
                        return console.error(errors.database.error_1.message, err);
                    } else {

                        // Database Query
                        client.query('SELECT * FROM Apps WHERE app_name=$1;', [
                            req.params.app_name
                        ], function(err, result) {
                            done();

                            if (err) {
                                res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                return console.error(errors.database.error_2.message, err);
                            } else {

                                // Check if App exists
                                if (result.rows.length === 0) {
                                    res.status(errors.query.error_1.code).send(errors.query.error_1);
                                    console.error(errors.query.error_1.message);
                                } else {

                                    // Database Query
                                    client.query('SELECT * FROM Logs WHERE app_name=$1;', [
                                        req.params.app_name
                                    ], function(err, result) {
                                        done();

                                        if (err) {
                                            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                            return console.error(errors.database.error_2.message, err);
                                        } else {

                                            // Send Result
                                            res.status(200).send(result.rows);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            /*}
        });
    }*/
};
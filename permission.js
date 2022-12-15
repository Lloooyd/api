const moment = require("moment");
const unit = (app, pool) => {


    app.post('/api/permission/list', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/permission/list');
        console.log(req.body)

        let username = req.body.username;

        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);

                var sql = "SELECT * FROM permission WHERE username = ?";
                console.log(sql) 

                connection.query(sql, [username], function (error, results) {
                    if (error) {
                        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + error)
                        connection.release();
                        res.status(500).json({ error: "ERROR QUERY" });
                    } else {
                        connection.release();
                        res.status(200).json(results);
                    }
                }
                );


            };
        });
    }) 

    app.post('/api/permission/update', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/permission/update');
        console.log(req.body)

        let username = req.body.username;
        let module = req.body.module;
        let allowed = req.body.allowed;
        
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                //insert update
                var sql = "";
                sql = "SELECT id FROM permission WHERE username = ? and module = ?"
                connection.query(sql, [username, module], function (error, results) {
                    if (error) {
                        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + error)
                        connection.release();
                        res.status(500).json({ error: "ERROR QUERY" });
                    } else {
                        
                        if (results.length > 0) {
                            //update
                            sql = "UPDATE permission SET allowed = ? WHERE username = ? and module = ?";
                            connection.query(sql, [allowed, username, module], function (error, results) {
                                if (error) {
                                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + error)
                                    connection.release();
                                    res.status(500).json({ error: "ERROR QUERY" });
                                } else {
                                    connection.release();
                                    res.status(200).json(results);
                                }
                            }
                            );

                        } else {
                            //insert
                            sql = "INSERT INTO permission(username, module, allowed) VALUES(?, ?, ?)";
                            connection.query(sql, [username, module, allowed], function (error, results) {
                                if (error) {
                                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + error)
                                    connection.release();
                                    res.status(500).json({ error: "ERROR QUERY" });
                                } else {
                                    connection.release();
                                    res.status(200).json(results);
                                }
                            }
                            );
                        }
                    }
                }
                );

            };
        });

    })

    

}


module.exports = unit;
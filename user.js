const moment = require("moment");
const user = (app, pool) => {

    app.post('/api/user/auth', (req, res) => {

        req.checkBody("username", "Missing parameter").notEmpty()
        req.checkBody("password", "Missing parameter").notEmpty()

        var errors = req.validationErrors();
        if (errors) {
            console.log( moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + errors)
            res.status(500).json(errors);
            return;
        }

        console.log(req.body);
        let username = req.body.username;
        let password = req.body.password;

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/user/auth');
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);

                var sql = "SELECT a.*, b.* FROM user a INNER JOIN permission b ON a.username = b.username WHERE a.username = ? and a.password = ?";
                console.log(sql)

                connection.query(sql, [username, password], function (error, results) {
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


    app.get('/api/user/list', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' GET /api/user/list');
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);

                var sql = "SELECT * FROM user ORDER BY lastname";
                console.log(sql)

                connection.query(sql, function (error, results) {
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

    app.post('/api/user/exist', (req, res) => {

        let username = req.body.username;
        let oldusername = req.body.oldusername;
        let isedit = req.body.isedit;

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/user/exist');
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                var sql = "";
                if(isedit) {
                    sql = "SELECT * FROM user WHERE username = '" + username + "' and username <> '" + oldusername + "'";
                }  else {
                    sql = "SELECT * FROM user WHERE username = '" + username + "'";
                }
                
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql);

                connection.query(sql, function (error, results) {
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


    app.post('/api/user/add', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/user/add');
        console.log(req.body)

        let firstname = req.body.firstname;
        let middlename = req.body.middlename;
        let lastname = req.body.lastname;
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;

        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                var sql = "insert into user(firstname, middlename, lastname, username, password, email) values(?, ?, ?, ?, ?, ?)";
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql);

                connection.query(sql, [firstname, middlename, lastname, username, password, email], function (error, results) {
                    if (error) {
                        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + error)
                        connection.release();
                        res.status(500).json({ error: "ERROR QUERY" });
                    } else {
                        // connection.release();
                        res.status(200).json(results);

                        //default permission
                        sql = "INSERT INTO permission(username, module, allowed) values(?, ?, ?) ";
                        connection.query(sql, [username, "dashboard", 1], function (error, results) {
                            if (error) {
                                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + error)
                                connection.release();
                                res.status(500).json({ error: "ERROR QUERY" });
                            } else {
                                connection.release();
                            }
                        }
                        );
                    }
                }
                );

            };
        });

    })

    app.post('/api/user/delete', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/user/delete');
        console.log(req.body)

        let username = req.body.username;

        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                var sql = "delete from user where username = ?";
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql);

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

    app.post('/api/user/update', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/user/update');
        console.log(req.body)

        let firstname = req.body.firstname;
        let middlename = req.body.middlename;
        let lastname = req.body.lastname;
        let oldusername = req.body.oldusername;
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;

        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                var sql = "update user set firstname = ?, middlename = ?, lastname = ?, username = ?, password = ?, email = ? where username = ?";
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql);

                connection.query(sql, [firstname, middlename, lastname, username, password, email, oldusername], function (error, results) {
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

}


module.exports = user;
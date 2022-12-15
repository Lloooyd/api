const moment = require("moment");
const forms = (app, pool) => {

    app.get('/api/forms/list', (req, res) => {

        try {

            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/forms/list');
            let code = req.body.code;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);

                    var sql = "SELECT * FROM forms ORDER BY description";
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

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "ERROR QUERY" });

        }


    })

    app.post('/api/forms/exist', (req, res) => {

        try {

            let description = req.body.description;
            let newdescription = req.body.newdescription;
            let isedit = req.body.isedit;

            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/forms/exist');
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    var sql = "";
                    if (isedit) {
                        sql = "SELECT * FROM forms WHERE description = '" + newdescription + "' and description <> '" + description + "'";
                    } else {
                        sql = "SELECT * FROM forms WHERE description = '" + description + "'";
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

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "ERROR QUERY" });
        }



    })

    app.post('/api/forms/add', (req, res) => {

        try {

            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/forms/add');
            console.log(req.body)

            let description = req.body.description;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    var sql = "insert into forms(description) values(?)";
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql);

                    connection.query(sql, [description], function (error, results) {
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

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "ERROR QUERY" });
        }



    })

    app.post('/api/forms/delete', (req, res) => {

        try {

            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/forms/delete');
            console.log(req.body)

            let id = req.body.id;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    var sql = "delete from forms where id = ?";
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql);

                    connection.query(sql, [id], function (error, results) {
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


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "ERROR QUERY" });
        }


    })

    app.post('/api/forms/update', (req, res) => {

        try {

            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/forms/update');
            console.log(req.body)

            let id = req.body.id;
            let description = req.body.description;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    var sql = "update forms set description = ? where id = ?";
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql);

                    connection.query(sql, [description, id], function (error, results) {
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

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "ERROR QUERY" });
        }



    })

}


module.exports = forms;
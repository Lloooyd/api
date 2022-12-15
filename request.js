const moment = require("moment");
const nodemailer = require('nodemailer');

const request = (app, pool) => {

    app.post('/api/request/list', (req, res) => {
        try {

            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/request/list');
            let sno = req.body.sno;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                    
                    var sql = "SELECT * FROM request WHERE sno = ?";
                    console.log(sql)

                    connection.query(sql,[sno], function (error, results) {
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

    app.post('/api/request/exist', (req, res) => {
        try {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/request/exist');
            let sno = req.body.sno;
            let docid = req.body.docid;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    var sql = "SELECT * FROM request WHERE sno = ? AND docid = ? AND status = 0";
                    connection.query(sql,[sno, docid], function (error, results) {
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

    app.post('/api/request/status', (req, res) => {
        try {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/request/status');
            let status = req.body.status;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    var sql = "SELECT request.id, request.docid, forms.description, request.reqdate, request.copies, student.sno, student.lastname, student.firstname, student.middlename, student.email, student.program, student.yearlevel  FROM `request` INNER JOIN `student` ON request.sno = student.sno INNER JOIN `forms` ON request.docid = forms.id WHERE request.status = ?";
                    connection.query(sql,[status], function (error, results) {
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

    app.post('/api/request/updatestatus', (req, res) => {
        try {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/request/update-status');
            let requestID = req.body.requestID;
            let status = req.body.status;
            let date = moment().format('MM-DD-YYYY');

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {
                    if(status == 1 ) {
                        var sql = "UPDATE request SET status = ?, appdate = ?  WHERE id = ?";
                    } else  if(status == 2 ) {
                        var sql = "UPDATE request SET status = ?, pickupdate = ?  WHERE id = ?";
                    } else if(status == 3 ) {
                        var sql = "UPDATE request SET status = ?, completeddate = ?  WHERE id = ?";
                    } else if(status == 4 ) {
                        var sql = "UPDATE request SET status = ?, rejecteddate = ?  WHERE id = ?";
                    }
                    connection.query(sql,[status, date, requestID], function (error, results) {
                        if (error) {
                            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + error)
                            connection.release();
                            res.status(500).json({ error: "ERROR QUERY" });
                        } else {
                            connection.release();


                            // EMAILSENDING
                            let email = req.body.email;
                
                            let updateTemplate = "";
                           
                            updateTemplate += '<!DOCTYPE html> '
                            updateTemplate += '<html  style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> '
                            updateTemplate += '<head> '
                            updateTemplate += '<meta name="viewport" content="width=device-width" /> '
                            updateTemplate += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> '
                            updateTemplate += '</head> '
                            updateTemplate += '<body> '
                            updateTemplate += '<pre>'
                            if(status == 0) {

                                updateTemplate += 'Your request has been sent.'
                                updateTemplate += '<br><br>You will be notified once your request has been approved.'
                                updateTemplate += '<br><br>You may also track your document request on your iRequest Account.'
                                updateTemplate += '<br><br>Thank you!'
                                updateTemplate += "<br><br>PLSP Registrar's Office"
                           
                            } else if(status == 1) {

                                updateTemplate += ' Your request has been approved!'
                                updateTemplate += '<br><br>You will be notified once your request is ready for pick up.'
                                updateTemplate += '<br><br>You may also track your document request on your iRequest Account.'
                                updateTemplate += '<br><br>Thank you!'
                                updateTemplate += "<br><br>PLSP Registrar's Office"

                            }
                            if(status == 2) {

                                updateTemplate += 'Your request is now ready for pick up!.'
                                updateTemplate += '<br><br>Kindly present the needed requirements to the registrar window for faster transaction.'
                                updateTemplate += '<br><br>Thank you!'
                                updateTemplate += "<br><br>PLSP Registrar's Office"
                               
                            } else if(status == 3) {

                                updateTemplate += 'Your request has been completed!'
                                updateTemplate += '<br><br>For more document request, kindly visit your iRequest account.'
                                updateTemplate += '<br><br>Thank you!'
                                updateTemplate += "<br><br>PLSP Registrar's Office"

                            } if(status == 4) {

                                updateTemplate += 'Your request has been rejected!'
                                updateTemplate += '<br><br>It must be rejected for some reason.'
                                updateTemplate += '<br><br>To make another document request, kindly visit your iRequest account.'
                                updateTemplate += '<br><br>Thank you!'
                                updateTemplate += "<br><br>PLSP Registrar's Office"

                            }
                           
                            updateTemplate += '</pre>'
                            updateTemplate += ' </body> '
                            updateTemplate += '</html> '
                
                
                            var transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: true, 
                                "auth": {
                                    "user": 'groupfour.irequest@gmail.com',
                                    "pass": 'ygqlgpadgkbxwcam'
                                }
                            });
                
                            var mailOptions = {
                                from: 'groupfour.irequest@gmail.com',
                                to: email,
                                subject: 'iRequest Update',
                                html: updateTemplate,
                            };
                
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    res.status(500).json(error)
                                    console.log(error)
                                    return;
                                }

                                res.status(200).json(results);

                                // console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")  + ': message sent: email :' + email + ", otp:" + otp + " : " + info.response);
                                // res.status(200).json(info.response)
                            });


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

    app.post('/api/request/add', (req, res) => {
        try {

            let sno = req.body.sno;
            let docid = req.body.docid;

            let status = 0;
            let reqdate = moment().format('MM-DD-YYYY');
            let expecteddate = moment().add(7, 'days').format('MM-DD-YYYY');  

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {

                    var sql = "insert into request (sno, docid, status, reqdate, expecteddate) values (?,?,?,?,?)";
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql);

                    connection.query(sql, [sno, docid, status, reqdate, expecteddate], function (error, results) {
                        if (error) {
                            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + error)
                            connection.release();
                            res.status(500).json({ error: "ERROR QUERY" });
                        } else {
                            connection.release();
                                // EMAILSENDING
                                let email = req.body.email;
                    
                                let updateTemplate = "";
                            
                                updateTemplate += '<!DOCTYPE html> '
                                updateTemplate += '<html  style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> '
                                updateTemplate += '<head> '
                                updateTemplate += '<meta name="viewport" content="width=device-width" /> '
                                updateTemplate += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> '
                                updateTemplate += '</head> '
                                updateTemplate += '<body> '
                                updateTemplate += '<p>'
                                updateTemplate += 'Your request has been sent.'
                                updateTemplate += '<br><br>You will be notified once your request has been approved.'
                                updateTemplate += '<br><br>You may also track your document request on your iRequest Account.'
                                updateTemplate += '<br><br>Thank you!'
                                updateTemplate += "<br><br>PLSP Registrar's Office"
                                updateTemplate += '</p>'
                                updateTemplate += ' </body> '
                                updateTemplate += '</html> '
                    
                    
                                var transporter = nodemailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    secure: true, 
                                    "auth": {
                                        "user": 'groupfour.irequest@gmail.com',
                                        "pass": 'ygqlgpadgkbxwcam'
                                    }
                                });
                    
                                var mailOptions = {
                                    from: 'groupfour.irequest@gmail.com',
                                    to: email,
                                    subject: 'iRequest Update',
                                    html: updateTemplate,
                                };
                    
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        res.status(500).json(error)
                                        console.log(error)
                                        return;
                                    }

                                    res.status(200).json(results);
                                });
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

    app.get('/api/request/counts-per-status', (req, res) => {
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                    res.status(500).json({ error: "CONNECTION" });
                } else {
                    var sql = "SELECT (SELECT COUNT(status) FROM request WHERE status = 0) AS pending_count, (SELECT COUNT(status) FROM request WHERE status = 1) AS approved_count, (SELECT COUNT(status) FROM request WHERE status = 2) AS forpickup_count, (SELECT COUNT(status) FROM request WHERE status = 3) AS completed_count, (SELECT COUNT(status) FROM request WHERE status = 4) AS rejected_count";
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




}


module.exports = request;
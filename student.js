const moment = require("moment");
const student = (app, pool) => {

  app.post('/api/student/login', (req, res) => {
      req.checkBody("sno", "Missing parameter").notEmpty()
      req.checkBody("password", "Missing parameter").notEmpty()

      var errors = req.validationErrors();
      if (errors) {
          console.log( moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + errors)
          res.status(500).json(errors);
          return;
      }

      console.log(req.body);
      let sno = req.body.sno;
      let password = req.body.password;

      console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/user/auth');
      pool.getConnection((err, connection) => { 
          if (err) {
              console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
              res.status(500).json({ error: "CONNECTION" });
          } else {

              console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);

              var sql = "SELECT * FROM student WHERE sno = ? and password = ?";
              console.log(sql)

              connection.query(sql, [sno, password], function (error, results) {
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

    app.post('/api/student/list', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/student/list');
        console.log(req.body)

        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            res.status(500).json(errors);
            return;
        }

        let id = req.body.id;
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' id : ' + id);
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
                res.status(500).json({ error: "CONNECTION" });
            } else {

                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);

                var sql = "SELECT * FROM student ORDER BY lastname, firstname, middlename";
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

    app.post('/api/student/exist', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/student/exist');
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + req.body);
        
        let sno = req.body.sno;
        let lastname = req.body.lastname;
    
        pool.getConnection((err, connection) => {
          if (err) {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
            res.status(500).json({ error: "CONNECTION" });
          } else {
    
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
    
            var sql = "SELECT * FROM student WHERE sno = ? and lastname = ?";    
            connection.query(sql, [sno, lastname],
              function (error, results) {
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

      app.post('/api/student/data', (req, res) => {

        let sno = req.body.sno;
    
        pool.getConnection((err, connection) => {
          if (err) {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
            res.status(500).json({ error: "CONNECTION" });
          } else {
    
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
    
            var sql = "SELECT firstname, middlename, lastname, program, major, yearlevel, email FROM student WHERE sno = ? ";    
            connection.query(sql, [sno],
              function (error, results) {
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

    app.post('/api/student/insert', (req, res) => {

        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/student/insert');
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + req.body);
        
        let sno = req.body.sno;
        let lastname = req.body.lastname;
        let firstname = req.body.firstname;
        let middlename = req.body.middlename;
        let program = req.body.program;
        let major = req.body.major;
        let yearlevel = req.body.yearlevel;
        let email = req.body.email;
        let mobile = req.body.mobile;
        let address = req.body.address;
        let username = req.body.username;
        let password = req.body.password;
    
        pool.getConnection((err, connection) => {
          if (err) {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
            res.status(500).json({ error: "CONNECTION" });
          } else {
    
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
    
            var sql = "";
            sql += "INSERT INTO student(sno, lastname, firstname, middlename, program, major, yearlevel, email, mobile, address) ";
            sql += "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql)
    
            connection.query(sql, [sno, lastname, firstname, middlename, program, major, yearlevel, email, mobile, address],
              function (error, results) {
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
    
      app.post('/api/student/update', (req, res) => {
    
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/student/update');
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + req.body);
    
        let id = req.body.id;
        let sno = req.body.sno;
        let lastname = req.body.lastname;
        let firstname = req.body.firstname;
        let middlename = req.body.middlename;
        let program = req.body.program;
        let major = req.body.major;
        let yearlevel = req.body.yearlevel;
        let email = req.body.email;
        let mobile = req.body.mobile;
        let address = req.body.address;
 
        let oldsno = req.body.oldsno;
        let oldlastname = req.body.oldlastname;

        pool.getConnection((err, connection) => {
          if (err) {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
            res.status(500).json({ error: "CONNECTION" });
          } else {
    
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
    
            var sql = "";
            sql += "UPDATE student SET sno = ?, lastname = ?, firstname = ?, middlename = ?, program = ?, major = ?, yearlevel = ?, email = ?, mobile = ?, address = ? ";
            sql += "WHERE sno = ? and lastname = ?";
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql)
    
            connection.query(sql, [sno, lastname, firstname, middlename, program, major, yearlevel, email, mobile, address, oldsno, oldlastname],
              function (error, results) {
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

      app.post('/api/student/register', (req, res) => {
    
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/student/register');
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + req.body);
    
        let sno = req.body.sno;
        let lastname = req.body.lastname;
        let password = req.body.password;

        pool.getConnection((err, connection) => {
          if (err) {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
            res.status(500).json({ error: "CONNECTION" });
          } else {
    
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
    
            var sql = "";
            sql += "UPDATE student SET password = ? ";
            sql += "WHERE sno = ? and lastname = ?";
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql)
    
            connection.query(sql, [password, sno, lastname],
              function (error, results) {
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
    
      app.post('/api/student/delete', (req, res) => {
    
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/student/delete');
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + req.body);

        let sno = req.body.sno;
        let lastname = req.body.lastname;
        
        pool.getConnection((err, connection) => {
          if (err) {
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' Connection - ' + err)
            res.status(500).json({ error: "CONNECTION" });
          } else {
    
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' connected as id ' + connection.threadId);
    
            var sql = "DELETE FROM student WHERE sno = ? and lastname = ?";
            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' ' + sql)
    
            connection.query(sql, [sno, lastname],
              function (error, results) {
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


module.exports = student;
const dotenv = require('dotenv').config();
const bodyParser = require("body-parser");
const mysql = require('mysql');
const express = require("express");
const cors = require("cors");
const validator = require("express-validator");
const moment = require("moment");
const basicAuth = require('express-basic-auth')
const app = express();

//MYSQL
const pool = mysql.createPool({
  connectionLimit: process.env.DB_LIMIT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

console.log('*************************');
console.log('');
console.log('HOST : ' + process.env.DB_HOST);
console.log('PORT : ' + process.env.DB_PORT);
console.log('USER : ' + process.env.DB_USER);
console.log('DATABASE : ' + process.env.DB_DATABASE);
console.log('LIMIT : ' + process.env.DB_LIMIT);
console.log('');
console.log('*************************');

app.use(bodyParser.json({limit: '50mb'}));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  extended: true,
  parameterLimit:50000
  })
);
app.use(validator());
app.use(cors());

app.use(basicAuth({
  users: { 'irequest': '1r3qu3st' }
}))

//MODULE
const student = require('./student')
const mail = require('./mail')
const user = require('./user')
const permission = require('./permission')
const forms = require('./forms')
const request = require('./request')

student(app, pool);
user(app, pool);
permission(app, pool);
forms(app, pool); 
request(app, pool); 
mail(app);

app.get("/api/version", (req, res) => {
  console.log(
    moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + " get version"
  );
  res.status(200).json({ version: "iRequest v1.0.0" }); 
});


//host api
const server = app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(
      moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + " Error : " + error
    );
    return;
  }

  console.log(
    moment(new Date()).format("YYYY-MM-DD HH:mm:ss") +
    ` start listening api on port ${server.address().port}`
  );


});

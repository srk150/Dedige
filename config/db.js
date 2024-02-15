var mysql = require("mysql");
let dotenv = require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(function (error) {
  if (error) {
    console.error('Error connecting to database: ' + error.stack);
    return;
  }
  console.log("Database Connected Successfully..!!");
});

module.exports = connection;
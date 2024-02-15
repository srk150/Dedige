var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "portfolio_web",
});

connection.connect(function (error) {
  if (error) {
    console.error('Error connecting to database: ' + error.stack);
    return;
  }
  console.log("Database Connected Successfully..!!");
});

module.exports = connection;
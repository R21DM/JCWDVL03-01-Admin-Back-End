const mysql = require("mysql");

const db = mysql.createPool({
  host: "127.0.0.1" || "localhost",
  user: "root" || "test",
  password: "@Alfath123" || "test",
  database: "db_pharmacy",
  port: 3306,
  multipleStatements: true,
});

db.getConnection((err, connection) => {
  if (err) {
    return console.error(`error : ${err.message}`);
  }
  console.log(`Connected to MySQL Server`);
});

module.exports = db;

const mysql = require("mysql");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "@Alfath123",
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

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "test",
//   password: "test",
//   database: "db_pharmacy",
// });

// module.exports = connection;

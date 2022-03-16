const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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

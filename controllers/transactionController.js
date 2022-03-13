const db = require("../database");
require("dotenv").config();

//GET transactions data
const getTransactions = (req, res) => {
  const QUERY = `SELECT invoice_user_header.*, username FROM db_pharmacy.invoice_user_header INNER JOIN user ON user_id = user.id;`;

  db.query(QUERY, (err, result) => {
    console.log(QUERY);
    res.status(200).send(result);
  });
};

module.exports = { getTransactions };

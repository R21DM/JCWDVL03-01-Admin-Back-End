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

//GET transactions data by ID
const getTransactionsByID = (req, res) => {
  const ID = req.params.id;
  const QUERY = `SELECT invoice_user_detail.*, name, unit, volume, code, status, total_price, invoice_user_header.user_id, address, city, zip_code, shipping, payment_proof.filename FROM (db_pharmacy.invoice_user_detail INNER JOIN db_pharmacy.product ON product_id = product.id INNER JOIN db_pharmacy.invoice_user_header ON invoice_user_detail.invoice_id = invoice_user_header.id INNER JOIN db_pharmacy.payment_proof USING (invoice_id)) WHERE invoice_id=${ID};`;

  db.query(QUERY, (err, result) => {
    console.log(QUERY);
    res.status(200).send(result);
  });
};

//PUT transactions status
const changeTransactionStatus = (req, res) => {
  const ID = req.body.id;
  const ACT = req.body.act;
  const QUERY = `UPDATE invoice_user_header SET status = '${ACT}' WHERE (id = ${ID});`;

  db.query(QUERY, (err, result) => {
    console.log(QUERY);
    res.status(200).send(result);
  });
};

//POST product sold
const productSold = (req, res) => {
  const USERID = req.params.userid;
  const USERNAME = req.params.username;

  req.body.map((val) => {
    const ID = val.product_id;
    const PRODUCT = val.name;
    const QTY = val.qty;

    let QUERY = `INSERT INTO db_pharmacy.product_log (user_id, username, product_id, product_name, qty, detail) VALUES (\'${USERID}\', \'${USERNAME}\', \'${ID}\', \'${PRODUCT}\', \'${QTY}\', \'Sold\');`;
    db.query(QUERY, (err, result) => {
      let QUERY = `UPDATE db_pharmacy.product SET volume = volume-${QTY} WHERE id=${ID};`;
      db.query(QUERY, (err, result) => {
        console.log(result);
      });
    });
  });
  res.status(200).send("Successfully sending data to product log");
};

module.exports = {
  getTransactions,
  getTransactionsByID,
  changeTransactionStatus,
  productSold,
};

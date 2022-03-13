const db = require("../database");
require("dotenv").config();

//GET user cart
const userCart = (req, res) => {
  const ID = req.query.id;
  const QUERY = `SELECT * FROM db_pharmacy.cart INNER JOIN db_pharmacy.product ON cart.product_id = product.id WHERE user_id=${ID};`;

  db.query(QUERY, (err, result) => {
    console.log(QUERY);

    //Calculate total price in cart
    const totalPrice = result
      .map((val) => {
        return val.total_price;
      })
      .reduce((a, b) => {
        return a + b;
      });
    console.log("Total: ", totalPrice);

    res.status(200).send({ result, totalPrice });
  });
};

//POST cart data
const addToCart = (req, res) => {
  const USERID = req.body.userId;
  const PRODUCTID = req.body.productId;
  const QTY = req.body.qty;
  const PRICE = req.body.price;
  const QUERY = `INSERT INTO db_pharmacy.cart (\`user_id\`, \`product_id\`, \`qty\`, \`price\`) VALUES (${USERID}, ${PRODUCTID}, ${QTY}, ${PRICE});`;

  console.log(QUERY);

  db.query(QUERY, (err, result) => {
    res.status(200).send(result);
  });
};

module.exports = { addToCart, userCart };

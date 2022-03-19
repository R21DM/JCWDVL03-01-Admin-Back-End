const db = require("../database");
require("dotenv").config();

module.exports = {
  getData: (req, res) => {
    // Query tidak ditampilkan di sini.
    // Buat seperti: userService.addUser(userData) yang diambil dari userServices

    let scriptQuery = `SELECT * FROM product`;

    // Product variables
    const ID = req.query.id;

    // Search product name
    if (req.query.name) {
      scriptQuery = `SELECT * FROM product where name like ${db.escape(
        req.query.name
      )}`;
    }

    // Search product's type

    if (req.query.type) {
      scriptQuery = `SELECT * FROM product where type like ${db.escape(
        req.query.type
      )} `;

      if (req.query.name) {
        scriptQuery = `SELECT * FROM product where name like ${db.escape(
          req.query.name
        )} AND type like ${db.escape(req.query.type)}`;
        if (req.query.minPrice) {
          scriptQuery = `SELECT * FROM product where name like ${db.escape(
            req.query.name
          )} AND type like ${db.escape(
            req.query.type
          )} AND price >= ${db.escape(req.query.minPrice)}`;
        }
      }

      if (req.query.minPrice) {
        scriptQuery = `SELECT * FROM product where type like ${db.escape(
          req.query.type
        )} AND price >= ${db.escape(req.query.minPrice)}`;
        if (req.query.name) {
          scriptQuery = `SELECT * FROM product where name like ${db.escape(
            req.query.name
          )} AND type like ${db.escape(
            req.query.type
          )} AND price >= ${db.escape(req.query.minPrice)}`;
        }
      }
    }

    // Search product's price

    if (req.query.minPrice) {
      scriptQuery = `SELECT * FROM product where price >= ${db.escape(
        req.query.minPrice
      )} `;

      if (req.query.name) {
        scriptQuery = `SELECT * FROM product where name like ${db.escape(
          req.query.name
        )} AND price >= ${db.escape(req.query.minPrice)} `;
        if (req.query.type) {
          scriptQuery = `SELECT * FROM product where name like ${db.escape(
            req.query.name
          )} AND price >= ${db.escape(
            req.query.minPrice
          )} AND type like ${db.escape(req.query.type)}`;
        }
      }
      if (req.query.type) {
        scriptQuery = `SELECT * FROM product where type like ${db.escape(
          req.query.type
        )} AND price >= ${db.escape(req.query.minPrice)} `;
        if (req.query.name) {
          scriptQuery = `SELECT * FROM product where name like ${db.escape(
            req.query.name
          )} AND price >= ${db.escape(
            req.query.minPrice
          )} AND type like ${db.escape(req.query.type)}`;
        }
      }
    }

    //Get product detail data
    if (ID) {
      scriptQuery = `SELECT * FROM product WHERE id=${ID}`;
      console.log(scriptQuery);
    }
    if (req.query.sort) {
      scriptQuery += ` order by price ${req.query.sort}`;
      console.log(scriptQuery);
    }

    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  getLog: (req, res) => {
    let scriptQuery = "SELECT * FROM product_log where detail = 'Sold'";

    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  getTotal: (req, res) => {
    let scriptQuery = `SELECT  product_name, price, cost, sum(qty) as qty, 
    (sum(qty)*price - sum(qty)*cost) as total_profit,
    (sum(qty)*cost) as total_cost, (sum(qty)*price) as revenue from product_log l 
    join product p on p.name = l.product_name  where detail = 'Sold' group by p.id; `;

    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      console.log(results);
      res.status(200).send(results);
    });
  },
  getMostSold: (req, res) => {
    let scriptQuery =
      "SELECT product_name, sum(qty) as jumlah from product_log where detail = 'Sold' group by product_id order by length(jumlah) desc, jumlah desc;";

    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  addData: (req, res) => {
    console.log(req.body);
    let {
      name,
      price,
      volume,
      volume_per_bottle,
      unit,
      description,
      brand,
      drug_class,
      before_taking,
      dosage,
      type,
    } = req.body;
    let addProduct = `INSERT INTO db_pharmacy.product (name, price, volume, volume_per_bottle,unit, 
                      description,brand, drug_class, before_taking,dosage,type)
                       values  (
                    "${name}", ${price}, ${volume}, ${volume_per_bottle},
                    "${unit}", "${description}", "${brand}", "${drug_class}","${before_taking}",
                    "${dosage}", "${type}" )  ;`;
    console.log(addProduct);
    db.query(addProduct, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }

      db.query(
        `Select * from product where name = ${db.escape(name)};`,
        (err2, results2) => {
          if (err2) res.status(500).send(err2);
          res
            .status(200)
            .send({ message: "Penambahan Product Berhasil", data: results2 });
          // res.status(200).send(results)
        }
      );
    });
  },

  editData: (req, res) => {
    let dataUpdate = [];
    for (let prop in req.body) {
      dataUpdate.push(`${prop} = ${db.escape(req.body[prop])}`);
    }
    let data = dataUpdate.splice(1);
    console.log(data);
    let updateQuery = `UPDATE product set ${data} where id = ${req.params.id};`;
    console.log(updateQuery);
    db.query(updateQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  deleteData: (req, res) => {
    let deleteQuery = `DELETE from product where id = ${db.escape(
      req.params.id
    )};`;

    db.query(deleteQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};

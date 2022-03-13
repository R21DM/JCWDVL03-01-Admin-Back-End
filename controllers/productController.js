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

    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  getLog: (req, res) => {
    let scriptQuery = "SELECT * FROM product_log";

    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  addData: (req, res) => {
    console.log(req.body);
    let { username, password, email, phone } = req.body;
    let addDataUser = `Insert into user values (null,
    ${db.escape(username)},
    ${db.escape(password)},
    ${db.escape(email)},
    ${db.escape(phone)});`;
    console.log(addDataUser);
    db.query(addDataUser, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }

      db.query(
        `Select * from user where username = ${db.escape(username)};`,
        (err2, results2) => {
          if (err2) res.status(500).send(err2);
          res
            .status(200)
            .send({ message: "Penambahan Karyawan Berhasil", data: results2 });
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

    let updateQuery = `UPDATE user set ${dataUpdate} where id = ${req.params.id};`;
    console.log(updateQuery);
    db.query(updateQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  deleteData: (req, res) => {
    let deleteQuery = `DELETE from user where id = ${db.escape(
      req.params.id
    )};`;

    db.query(deleteQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};

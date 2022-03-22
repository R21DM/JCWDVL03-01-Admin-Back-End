const db = require("../database");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt = require("bcrypt");

module.exports = {
  getData: (req, res) => {
    // Query tidak ditampilkan di sini.
    // Buat seperti: userService.addUser(userData) yang diambil dari userServices

    if (!req.body.username) {
      return res.status(500).send("Username is required");
    }

    var reqPassword = req.body.password;
    if (!reqPassword) {
      return res.status(500).send("Password is required");
    }

    let queryUsername = `SELECT * FROM user where username = ${db.escape(
      req.body.username
    )}`;

    db.query(queryUsername, async (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length !== 1) return res.status(500).send("User not found");
      if (results[0].role !== 1) return res.status(500).send("User not found");
      let user = results[0];

      let stored_hash = user.password;
      console.log("password:", reqPassword);
      console.log("stored_hash:", stored_hash);

      if (stored_hash.length < 15) {
        // untuk pass yang belum hash

        if (stored_hash == reqPassword) {
          console.log("true");
          return res.status(200).send(user);
        } else res.status(500).send("Username and Password doesn't match");
      } else {
        if (await bcrypt.compare(reqPassword, stored_hash)) {
          console.log("true");
          // create JWT token -> return ke frontend
          // kalau bisa ada time-out
          console.log(results);
          res.status(200).send(user);
          return;
        } else {
          res.status(500).send("Username and Password doesn't match");
          return;
        }
      }
    });
  },
  getAllData: (req, res) => {
    let queryUsername = `SELECT * FROM user where token_data = ${db.escape(
      req.query.token
    )}`;

    db.query(queryUsername, (err, results) => {
      if (results.length < 1) return res.status(500).send("Can't get data");
      if (err) return res.status(500).send("Can't get data");
      console.log(results);
    });
  },

  getEmail: (req, res) => {
    // Entah kenapa harus pakai DNS
    // Entah kenapa harus pakai DNS
    // Entah kenapa harus pakai DNS
    // Entah kenapa harus pakai DNS
    // Entah kenapa harus pakai DNS

    let userQuery = `SELECT * FROM user where email = ${db.escape(
      req.query.email
    )}`;
    db.query(userQuery, (err, results) => {
      console.log(results);
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
  forgotEmail: (req, res) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let scriptQuery = `SELECT * FROM user where email = ${db.escape(
      req.query.email
    )}`;

    db.query(scriptQuery, (err, results) => {
      let respond = results[0];
      if (err) return res.status(500).send(err);
      if (!respond) return res.status(500).send(err);

      let mailOption = {
        from: `"Admin"${process.env.EMAIL}`,
        to: respond.email,
        subject: "Forgot Password",
        text: `Your username: ${respond.username},Your password: ${respond.password}`,
        html: `<h2>Hi there ${respond.username}!</h2>
        <p>You have recently visited our website and requested for your password.</p>
        <p>Your username: ${respond.username},</p>
        <p>Please change your password by clicking this <a href=http://localhost:3001/change-password?token=${respond.token_data}>link</a> </p>
        <p>Thank you</p>`, // html body
      };

      transporter.sendMail(mailOption, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent");
        }
      });
      res.status(200).send(results);
    });
  },

  //Show all user function
  showAllUser: (req, res) => {
    const QUERY = "SELECT * FROM db_pharmacy.user;";

    db.query(QUERY, (err, result) => {
      if (err) res.status(500).send(err);
      res.status(200).send(result);
    });
  },

  //Changing user status (active - deactive) function
  changeActiveUser: (req, res) => {
    const ID = req.body.id;
    const STATUS = req.body.status;
    const QUERY = `UPDATE db_pharmacy.user SET verified_user = ${STATUS} WHERE (id = ${ID});`;

    db.query(QUERY, (err, result) => {
      if (err) res.status(500).send(err);
      res.status(200).send(result);
    });
  },
  changePass: (req, res) => {
    const PASSWORD = req.body.password;

    //Hash Password
    const SALT = bcrypt.genSaltSync(10);
    const HASH_PASSWORD = bcrypt.hashSync(PASSWORD, SALT);

    let updateQuery = `UPDATE user set password='${HASH_PASSWORD}' where token_data = ${db.escape(
      req.body.token
    )};`;
    console.log(updateQuery);

    db.query(updateQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};

const db = require("../database");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//GET username and email data
const getData = (req, res) => {
  const USERNAME = req.query.username;
  const EMAIL = req.query.email;
  const QUERY = `SELECT * FROM db_pharmacy.user WHERE username="${USERNAME}" OR email="${EMAIL}"`;

  console.log(QUERY);

  db.query(QUERY, (err, result) => {
    res.status(200).send(result);
  });
};

//POST Register
const postData = (req, res) => {
  const USERNAME = req.body.username;
  const PASSWORD = req.body.password;
  const EMAIL = req.body.email;
  const PHONE = req.body.phone;

  //Hash Password
  const SALT = bcrypt.genSaltSync(10);
  const HASH_PASSWORD = bcrypt.hashSync(PASSWORD, SALT);

  //Create SMTP Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rdmtest95",
      pass: "TESTrdm123",
    },
  });

  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  //Untuk verifikasi --> Simpan token di db --> Cek token di db

  const RANDOM = Math.random();

  const TOKEN = jwt.sign(
    {
      data: "Token Data",
    },
    RANDOM.toString()
  );

  const QUERY =
    "INSERT INTO `db_pharmacy`.`user` (`username`, `password`, `email`, `phone`, `token_data`) VALUES ('" +
    USERNAME +
    "', '" +
    HASH_PASSWORD +
    "', '" +
    EMAIL +
    "', '" +
    PHONE +
    "', '" +
    TOKEN +
    "');";

  console.log(QUERY);

  transporter.sendMail({
    from: '"Admin" <rdmtest95@gmail.com>', // sender address
    to: `${EMAIL}`, // list of receivers
    subject: "Email Verification", // Subject line
    text: `Hi there ${USERNAME}! 
      You have recently visited our website and entered your email.
      Please click the following link to verify your email http://localhost:3000/verify?username=${USERNAME}&token=${TOKEN} 
      Thanks`, // plain text body
    html: `<h2>Hi there ${USERNAME}!</h2>
      <p>You have recently visited our website and entered your email.</p>
      <p>Please click the following link to verify your email http://localhost:3000/verify?username=${USERNAME}&token=${TOKEN}</p>
      <p>Thanks</p>`, // html body
  });

  db.query(QUERY, (err, result) => {
    res.status(200).send(result);
  });
};

//GET verify
const verifyData = (req, res) => {
  const USERNAME = req.query.username;
  const TOKEN = req.query.token;
  //Check Username and Token Data
  const QUERY = `SELECT id FROM db_pharmacy.user WHERE username="${USERNAME}" AND token_data="${TOKEN}"`;

  console.log(QUERY);

  db.query(QUERY, (err, result) => {
    //Approve to verified user if username and token data verified
    if (result.length) {
      console.log("Verification Success");

      //POST verified user
      const ID = result[0].id;
      const QUERY = `UPDATE db_pharmacy.user SET verified_user = '1' WHERE id = ${ID};`;

      db.query(QUERY, (err, result) => {
        res.status(200).send(result);
      });

      return;
    }

    //Error if username and token not match
    console.log("Verification Failed");
    res.status(404).send(result);
  });
};

module.exports = { getData, postData, verifyData };

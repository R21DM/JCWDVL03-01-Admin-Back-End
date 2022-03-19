const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const db = require("./database");
require("dotenv").config();

const PORT = process.env.PORT || 2001;
/////////////////////////////////////////////
//Multer configuration for Upload Image
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.query.name}.jpg`);
  },
});

//Multer configuration upload payment proof
const multerPaymentProof = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/paymentProof");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `paymentProof-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

const uploadPayment = multer({
  storage: multerPaymentProof,
});

//Upload Image
app.post("/", upload.single("uploaded-file"), (req, res) => {});

//Upload Image for Payment Proof
app.post("/paymentProof", uploadPayment.single("uploaded-file"), (req, res) => {
  const USERID = req.query.id;
  const FILENAME = req.file.filename;
  const QUERY = `INSERT INTO db_pharmacy.payment_proof (\`invoice_id\`, \`user_id\`, \`filename\`) SELECT \`id\`, \`user_id\`, \'${FILENAME}\' FROM db_pharmacy.invoice_user_header WHERE db_pharmacy.invoice_user_header.id = (SELECT MAX(id) FROM invoice_user_header WHERE user_id = ${USERID});`;

  console.log(QUERY);

  db.query(QUERY, (err, result) => {
    res.status(200).send(result);
  });
});

///////////////////////////////////////////////////

// Function to serve all static files
// inside public directory.
app.use("/products", express.static("public"));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h4>Welcome to dev-mysql-api</h4>");
});

const {
  userRouters,
  productRouters,
  registerRouter,
  cartRouters,
  transactionRouters,
} = require("./routers");

app.use("/users", userRouters);
app.use("/products", productRouters);
app.use("/", registerRouter);
app.use("/cart", cartRouters);
app.use("/transaction", transactionRouters);

app.listen(PORT, () => console.log("Api Running :", PORT));

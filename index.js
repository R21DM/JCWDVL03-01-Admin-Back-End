const express = require("express");
const multer = require("multer");
const cors = require("cors");
const db = require("./database");
const PORT = process.env.PORT || 2001;

const app = express();

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

const upload = multer({
  storage: multerStorage,
});

//Upload Image
app.post("/", upload.single("uploaded-file"), (req, res) => {});

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

// //Test db connection
// db.connect((error) => {
//   if (error) console.log(error);

//   console.log("Connected at thread id", db.threadId);
// });

app.use("/users", userRouters);
app.use("/products", productRouters);
app.use("/", registerRouter);
app.use("/cart", cartRouters);
app.use("/transaction", transactionRouters);

app.listen(PORT, () => console.log("Api Running :", PORT));

// //Start Server
// server.listen(PORT, () => {
//   console.log("Socket server is running at port:", PORT);
// });

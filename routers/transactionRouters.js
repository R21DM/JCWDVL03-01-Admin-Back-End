const express = require("express");
const { transactionController } = require("../controllers");
const routers = express.Router();

routers.get("/", transactionController.getTransactions);
routers.get("/:id", transactionController.getTransactionsByID);
routers.put("/status", transactionController.changeTransactionStatus);

module.exports = routers;

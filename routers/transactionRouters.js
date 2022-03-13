const express = require("express");
const { transactionController } = require("../controllers");
const routers = express.Router();

routers.get("/", transactionController.getTransactions);

module.exports = routers;

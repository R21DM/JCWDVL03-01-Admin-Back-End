const express = require("express");
const { productController } = require("../controllers");
const routers = express.Router();

routers.get("/get", productController.getData);
routers.get("/log", productController.getLog);

module.exports = routers;

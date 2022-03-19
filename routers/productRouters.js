const express = require("express");
const { productController } = require("../controllers");
const routers = express.Router();

routers.get("/get", productController.getData);
routers.get("/log", productController.getLog);
routers.get("/total", productController.getTotal);
routers.get("/sold", productController.getMostSold);
routers.delete("/:id", productController.deleteData);
routers.put("/:id", productController.editData);
routers.post("/add", productController.addData);

module.exports = routers;

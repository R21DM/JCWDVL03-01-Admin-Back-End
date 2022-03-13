const express = require("express");
const { cartController } = require("../controllers");
const routers = express.Router();

routers.get("/", cartController.userCart);
routers.post("/", cartController.addToCart);

module.exports = routers;

const express = require("express");
const { userController } = require("../controllers");
const routers = express.Router();

routers.post("/get", userController.getData);
routers.get("/get", userController.getEmail);
routers.get("/send", userController.forgotEmail);
routers.post("/add-user", userController.addData);
routers.patch("/edit-user/:id", userController.editData);
routers.delete("/delete-user/:iduser", userController.deleteData);

module.exports = routers;

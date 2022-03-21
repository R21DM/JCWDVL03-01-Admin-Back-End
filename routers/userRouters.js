const express = require("express");
const { userController } = require("../controllers");
const routers = express.Router();

routers.post("/get", userController.getData);
routers.get("/get", userController.getEmail);
routers.get("/send", userController.forgotEmail);
routers.post("/add-user", userController.addData);
routers.patch("/edit-user/:id", userController.editData);
routers.delete("/delete-user/:iduser", userController.deleteData);
routers.get("/showAllUser", userController.showAllUser);
routers.post("/status", userController.changeActiveUser);
routers.get("/username/:id", userController.getUsername);

module.exports = routers;

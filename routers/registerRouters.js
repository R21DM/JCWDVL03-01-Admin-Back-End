const express = require("express");
const { registerController } = require("../controllers");
const registerRouter = express.Router();

registerRouter.get("/register", registerController.getData);
registerRouter.get("/verify", registerController.verifyData);
registerRouter.post("/register", registerController.postData);

module.exports = registerRouter;

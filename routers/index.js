const registerRouter = require("./registerRouters");
const userRouters = require("./userRouters");
const productRouters = require("./productRouters");
const cartRouters = require("./cartRouters");
const transactionRouters = require("./transactionRouters");

module.exports = {
  registerRouter,
  userRouters,
  cartRouters,
  productRouters,
  transactionRouters,
};

const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  getAllOrders,
  getSingleOrders,
  updateOrders,
} = require("../controllers/userController");
const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/", getAllOrders);
router.get("/:id", getSingleOrders);
router.put("/update-user/", updateUserController);
router.put("/update-order/:id", updateOrders);
module.exports = router;

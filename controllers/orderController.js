const orderModel = require("../models/orderModel");

const getAllOrders = async (req, res) => {
  try {
    const userOrders = await orderModel
      .find()
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color");

    res.json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Error fetching user orders" });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    //user find
    const user = await userModel.findOne({ email });
    //password validate
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //updated useer
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile Updated Please Login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In User Update Api",
      error,
    });
  }
};

const getSingleOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const userOrders = await Order.findOne({ _id: id })
      .populate("orderItems.product")
      .populate("user")
      .populate("orderItems.color");

    res.json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Error fetching user orders" });
  }
};
const updateOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const userOrders = await Order.findById(id, { new: true });
    userOrders.orderStatus = req.body.status;
    await userOrders.save();
    res.json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Error fetching user orders" });
  }
};
module.exports = {
  updateOrders,
  getSingleOrders,
  getAllOrders,
};

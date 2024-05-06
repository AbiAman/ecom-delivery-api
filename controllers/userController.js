const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const JWT = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireSingIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "password is required and 6 character long",
      });
    }
    //exisiting user
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(500).send({
        success: false,
        message: "User Already Register With This Eail",
      });
    }
    //hashed pasword
    const hashedPassword = await hashPassword(password);

    //save user
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Registeration Successfull please login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email Or Password",
      });
    }
    // find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }
    //match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid usrname or password",
      });
    }
    //TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // undeinfed password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in login api",
      error,
    });
  }
};
//update user
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

const getAllOrders = async (req, res) => {
  try {
    const userOrders = await Order.find().populate("orderItems.product");

    res.status(200).send({
      success: true,
      message: "All order data",
      userOrders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Error fetching user orders" });
  }
};
const getSingleOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const userOrders = await Order.findOne({ _id: id });

    res.json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Error fetching user orders" });
  }
};

const updateOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const userOrders = await Order.findById(id);

    if (!userOrders) {
      return res.status(404).json({ error: "Order not found" });
    }

    userOrders.orderStatus = req.body.status;
    await userOrders.save();

    res.status(200).send({
      success: true,
      message: "Order Status Updated Successfully",
      userOrders,
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ error: "Error updating order status" });
  }
};

/*const updateOrders = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: orderStatus || order.orderStatus },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Order Status Updated Successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in update order api",
      error: error.message,
    });
  }
};
*/
module.exports = {
  registerController,
  loginController,
  getAllOrders,
  getSingleOrders,
  updateUserController,
  updateOrders,
};

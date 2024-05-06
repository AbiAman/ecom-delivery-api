const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected To DATABASE`);
  } catch (error) {
    console.log(`error in connection DB ${error}`);
  }
};

module.exports = connectDB;

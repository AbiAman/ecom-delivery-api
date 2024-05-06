const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// MONGODB CONNECTION
connectDB();

app.use("/api/v1/auth", require("./routers/userRoutes"));
//app.use("/api/v1/order", require("./routers/orderRouter"));

app.get("/", (req, res)=>{
res.status(200).send({
"success":true,
"msg":"Node Serevr Running"
})
  })
const PORT = process.env.PORT || 8080;
//listen
app.listen(PORT, () => {
  console.log(`Server Runnning ${PORT}`);
});

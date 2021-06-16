const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const globalErrorHandler = require("./controllers/errorController");

//middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);

app.use(globalErrorHandler);

module.exports = app;

const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect("mongodb://localhost:27017/cart", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection is successful"));

const port = 3002;
const server = app.listen(port, () =>
  console.log(`application is listening on port ${port}`)
);

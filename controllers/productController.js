const factory = require("./factory");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// exports.getAllProducts = factory.getAll(Product);
// exports.getProductById = factory.getOne(Product);
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: true,
    data: products,
  });
});
exports.getProductById = catchAsync(async (req, res, next) => {
  let query = Product.findById(req.params.id);
  // if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError("no product found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.deleteProduct = factory.deleteOne(Product);

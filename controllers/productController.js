const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: true,
    data: products,
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  let query = Product.findById(req.params.id);
  const doc = await query;

  if (!doc) {
    return next(new AppError("no product found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    product: doc,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const doc = await Product.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

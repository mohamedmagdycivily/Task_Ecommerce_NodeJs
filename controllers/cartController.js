const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addItemToCart = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { productId } = req.body;
  const quantity = req.body.quantity * 1;

  //get cart and product
  const carts = await Cart.find().populate({
    path: "items.productId",
    select: "name price total",
  });
  let cart = carts[0];
  let product = await Product.findById(productId);

  if (!product) return next(new AppError("No product with this Id", 500));

  //if there is no cart -> create it and add the product
  if (!cart) {
    const cartData = {
      items: [
        {
          productId: productId,
          quantity: quantity,
          total: product.price * quantity,
          price: product.price,
        },
      ],
      subTotal: product.price * quantity,
    };
    cart = await Cart.create(cartData);
  }
  //if cart exist
  else {
    //check if item exist
    const itemIndex = cart.items.findIndex((item) => {
      return item.productId.id == productId;
    });

    //if the item exist in the cart but the quantity is set to zero or less than zero => remove the item
    if (itemIndex !== -1 && quantity <= 0) {
      cart.items.splice(itemIndex, 1);
      if (cart.items.length == 0) {
        cart.subTotal = 0;
      } else {
        cart.subTotal = cart.items
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
      }
    }
    //if the item exist in the cart and quantity > 0 => increase the quantity and update the calculations
    else if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += quantity;
      console.log(
        "cart.items[itemIndex].quantity = ",
        cart.items[itemIndex].quantity
      );

      cart.items[itemIndex].total =
        cart.items[itemIndex].quantity * product.price;
      console.log(
        " cart.items[itemIndex].total = ",
        cart.items[itemIndex].total
      );

      cart.subTotal = cart.items
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
      console.log(" cart.subTotal = ", cart.subTotal);
    }
    //if the item not exist in the cart and quantity > 0 => add the item to the cart
    else if (quantity > 0) {
      cart.items.push({
        productId: productId,
        quantity: quantity,
        price: product.price,
        total: product.price * quantity,
      });
      cart.subTotal = cart.items
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
    }
  }
  let data = await cart.save();
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getCart = catchAsync(async (req, res) => {
  const carts = await Cart.find().populate({
    path: "items.productId",
    select: "name price total",
  });
  let cart = carts[0];

  if (!cart) return next(new AppError("cart not found", 400));

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.emptyCart = catchAsync(async (req, res) => {
  const carts = await Cart.find().populate({
    path: "items.productId",
    select: "name price total",
  });
  let cart = carts[0];

  cart.items = [];
  cart.subTotal = 0;

  let data = await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

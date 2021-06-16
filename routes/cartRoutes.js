const router = require("express").Router();
const cartController = require("../controllers/cartController");

router
  .route("/")
  .post(cartController.addItemToCart)
  .get(cartController.getCart);
router.delete("/empty-cart", cartController.emptyCart);

module.exports = router;

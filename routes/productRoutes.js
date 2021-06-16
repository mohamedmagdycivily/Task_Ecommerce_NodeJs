const router = require("express").Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router
  .route("/:id")
  .get(productController.getProductById)
  .delete(productController.deleteProduct);

module.exports = router;

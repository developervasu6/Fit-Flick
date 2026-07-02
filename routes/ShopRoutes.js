import { Router } from "express";
import {
  addToCart,
  addToWishlist,
  createCategories,
  createOrder,
  createProduct,
  getOrder,
  removeFromCart,
  removeFromWishlist,
} from "../controllers/ShopController.js";
import multer from "multer";
import { productValidation } from "../middleware/ProductValidation.js";
import { verifyToken } from "../middleware/Auth.js";

const uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
});

const shopRouter = Router();

shopRouter.post(
  "/create/category",
  verifyToken,
  uploader.single("file"),
  createCategories,
);
shopRouter.post(
  "/create/product",
  verifyToken,
  uploader.array("files", 10),
  productValidation,
  createProduct,
);

shopRouter.post("/cart/add", verifyToken, addToCart);

shopRouter.delete("/cart/remove/:id", verifyToken, removeFromCart);

shopRouter.post("/wishlist/add", verifyToken, addToWishlist);
shopRouter.delete("/wishlist/remove/:id", verifyToken, removeFromWishlist);
shopRouter.post("/order/create", verifyToken, createOrder);
shopRouter.get("/:id", verifyToken, getOrder);
shopRouter.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default shopRouter;

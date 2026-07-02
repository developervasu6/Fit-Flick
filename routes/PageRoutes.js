import { Router } from "express";
import {
  adminCustomersPage,
  adminOrdersPage,
  adminProductsPage,
  cartPage,
  category,
  createCategoryPage,
  createProductPage,
  dashboardPage,
  indexPage,
  loginPage,
  orderPage,
  productPage,
  signupPage,
  wishlistPage,
} from "../controllers/PageRouteController.js";
import { verifyToken } from "../middleware/Auth.js";

const pageRouter = Router();

pageRouter.get("/", verifyToken, indexPage);
pageRouter.get("/signup", signupPage);
pageRouter.get("/login", loginPage);
pageRouter.get("/create-category", verifyToken, createCategoryPage);
pageRouter.get("/create-product", verifyToken, createProductPage);
pageRouter.get("/category/:slug", category);
pageRouter.get("/product/:productId", productPage);
pageRouter.get("/cart", verifyToken, cartPage);
pageRouter.get("/wishlist", verifyToken, wishlistPage);
pageRouter.get("/order/:id", verifyToken, orderPage);
pageRouter.get("/admin", verifyToken, dashboardPage);
pageRouter.get("/admin/customers", verifyToken, adminCustomersPage);
pageRouter.get("/admin/products", verifyToken, adminProductsPage);
pageRouter.get("/admin/orders", verifyToken, adminOrdersPage);

export default pageRouter;

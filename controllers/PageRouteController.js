import { Cart } from "../models/CartModel.js";
import { Category } from "../models/CategoriesModel.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/ProductModel.js";
import { User } from "../models/UserModel.js";
import { Wishlist } from "../models/WishlistModel.js";

export const indexPage = async (req, res) => {
  const categories = await Category.find();
  res.render("index", { categories, user: req.user || null });
};

export const signupPage = (req, res) => {
  res.render("signup");
};
export const loginPage = (req, res) => {
  res.render("login", { error: null });
};

export const createCategoryPage = (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    res.render("create-category", {
      error: "Not authorized user!",
      message: null,
    });
  }
  res.render("create-category", { error: null, message: null });
};

export const createProductPage = async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    res.render("create-product", {
      error: "Not authorized user!",
      message: null,
    });
  }
  const categories = await Category.find();
  res.render("create-product", { error: null, message: null, categories });
};

export const category = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  const products = await Product.find({
    category: category._id,
  });

  res.render("products", { products, category });
};

export const productPage = async (req, res) => {
  const product = await Product.findById(req.params.productId);

  res.render("product", { product });
};

export const cartPage = async (req, res) => {
  const cartItems = await Cart.find({ user: req.user._id }).populate("product");

  res.render("cart", { cartItems });
};

export const wishlistPage = async (req, res) => {
  const wishlistItems = await Wishlist.find({ user: req.user._id }).populate(
    "product",
  );

  res.render("wishlist", { wishlistItems });
};

export const orderPage = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "firstname lastname email",
    );

    if (!order) return res.status(404).send("Order not found");

    res.render("order", { order });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const dashboardPage = async (req, res) => {
  const user = req.user;
  try {
    if (user.role === "admin") {
      const orders = await Order.find().populate("products.productId");
      const products = await Product.find();

      // Calculate stats
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.totalBill || 0),
        0,
      );

      res.render("admin", {
        orders,
        totalOrders,
        totalRevenue,
        totalProducts,
        user,
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const adminCustomersPage = async (req, res) => {
  const user = req.user;
  try {
    if (user.role !== "admin") return res.redirect("/");

    const users = await User.find({ role: { $ne: "admin" } });

    const totalUsers = users.length;

    // New this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = users.filter(
      (u) => new Date(u.createdAt) >= startOfMonth,
    ).length;

    res.render("customers", { users, totalUsers, newThisMonth });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const adminProductsPage = async (req, res) => {
  const user = req.user;
  try {
    if (user.role !== "admin") return res.redirect("/");

    const products = await Product.find().populate("category");
    const totalProducts = products.length;

    res.render("admin-products", {
      products,
      totalProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const adminOrdersPage = async (req, res) => {
  const user = req.user;
  try {
    if (user.role !== "admin") return res.redirect("/");

    const orders = await Order.find()
      .populate("userId", "name email") // get customer name & email
      .sort({ createdAt: -1 }); // newest first

    // Stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "placed").length;
    const shippedOrders = orders.filter((o) => o.status === "shipped").length;
    const deliveredOrders = orders.filter(
      (o) => o.status === "delivered",
    ).length;

    res.render("orders", {
      orders,
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      user,
    });
  } catch (err) {
    console.error("adminOrdersPage ERROR:", err.message);
    res.status(500).send(err.message);
  }
};

import fs from "fs";
import { uploadFile } from "../cloudinary/cloudinary.config.js";
import { Category } from "../models/CategoriesModel.js";
import { Product } from "../models/ProductModel.js";
import { Cart } from "../models/CartModel.js";
import { log } from "console";
import { Wishlist } from "../models/WishlistModel.js";
import { Order } from "../models/Order.js";

// Create Category http://localhost:3000/api/shop/category
export const createCategories = async (req, res) => {
  try {
    const { title, slug } = req.body;

    if (!title || !slug) {
      return res.render("create-category", {
        error: "Title and slug are required!",
        message: null,
      });
    }

    if (!req.file) {
      return res.render("create-category", {
        error: "Image is required!",
        message: null,
      });
    }

    if (!req.user) {
      return res.render("create-category", {
        error: "Unauthorized user!",
        message: null,
      });
    }

    if (req.user.role !== "admin") {
      return res.render("create-category", {
        error: "Unauthorized user!",
        message: null,
      });
    }

    const existingCategory = await Category.findOne({ slug });

    if (existingCategory) {
      return res.render("create-category", {
        error: "Category already exists!",
        message: null,
      });
    }

    const upload = await uploadFile(req.file.path);
    fs.unlinkSync(req.file.path);

    if (!upload) {
      return res.render("create-category", {
        error: "Image upload failed",
        message: null,
      });
    }

    await Category.create({
      title,
      slug,
      imageURL: upload.secure_url,
      imageId: upload.public_id,
    });

    res.render("create-category", {
      error: null,
      message: "Category created successfully!",
    });
  } catch (error) {
    return res.render("create-category", {
      error: error.message,
      message: null,
    });
  }
};

// Create Product http://localhost:3000/api/shop/product
export const createProduct = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!req.user) {
      return res.render("create-product", {
        error: "Unauthorized user!",
        message: null,
        categories,
      });
    }

    if (req.user.role !== "admin") {
      return res.render("create-product", {
        error: "Unauthorized user!",
        message: null,
        categories,
      });
    }
    const { name, price, size, description, category } = req.body;
    const uploadedImages = [];

    // upload images to cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await uploadFile(file.path);

        uploadedImages.push({
          picId: upload.public_id,
          picURL: upload.secure_url,
        });

        // delete local file
        await fs.promises.unlink(file.path);
      }
    }
    // create product
    const product = await Product.create({
      name,
      price,
      size,
      description,
      category,
      images: uploadedImages,
    });

    res.render("create-product", {
      error: null,
      message: "Product created successfully!",
      product,
      categories,
    });
  } catch (error) {
    // remove uploaded temp files if error occurs
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.promises.unlink(file.path);
        } catch {}
      }
    }
    return res.render("create-product", {
      error: error.message,
      message: null,
      categories: null,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user._id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate size is available for this product
    if (!product.size.includes(size)) {
      return res
        .status(400)
        .json({ message: "Selected size is not available" });
    }

    // Check if same product + size already in cart
    const existing = await Cart.findOne({
      user: userId,
      product: productId,
      size,
    });
    if (existing) {
      return res.status(400).json({ message: "Item already in cart" });
    }

    const cartItem = await Cart.create({
      user: userId,
      product: productId,
      size,
    });

    console.log(cartItem);

    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  await Cart.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(200).json({ message: "Removed from cart" });
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existing = await Wishlist.findOne({
      user: userId,
      product: productId,
    });
    if (existing) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({
      user: userId,
      product: productId,
    });

    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (error) {
    console.log("ERROR:", error.message); // <-- add this
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Wishlist.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size, quantity = 1, cartItems } = req.body;

    let products = [];
    let totalBill = 0;

    if (productId) {
      // Buy Now - single product
      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      totalBill = product.price * quantity;
      products.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.picURL || "",
        price: product.price,
        size,
        quantity,
      });
    } else if (Array.isArray(cartItems) && cartItems.length > 0) {
      // Cart checkout
      for (const item of cartItems) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        totalBill += product.price * item.quantity;
        products.push({
          productId: product._id,
          name: product.name,
          image: product.images?.[0]?.picURL || "",
          price: product.price,
          size: item.size,
          quantity: item.quantity,
        });
      }
    } else {
      return res.status(400).json({ message: "No products provided" });
    }

    const order = await Order.create({ userId, products, totalBill });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET /api/order/:id
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("userId", "firstname lastname email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({ success: true, order });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

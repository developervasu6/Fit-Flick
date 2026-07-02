import bcryptjs from "bcryptjs";
import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// User Signup Function http://localhost:3000/api/auth/signup
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User Already exists", success: false });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    // redirect after success
    res.redirect("/login");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin Signup Function http://localhost:3000/api/auth/signup
export const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User Already exists", success: false });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      ...req.body,
      role: "admin",
      password: hashedPassword,
    });
    // redirect after success
    res.redirect("/login");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login Function http://localhost:3000/api/auth/login
export const login = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      res.render("login", { error: "Email and Password both is required!" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.render("login", {
        error: "User doesn't exist, Please Login!",
      });
    }
    const matchedPassword = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!matchedPassword) {
      return res.render("login", {
        error: "Password doesn't match!",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with https
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // redirect after success
    res.redirect("/");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    try {
      const token = req.cookies.token;

      if (!token) {
        req.user = null;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      req.user = user || null;
    } catch (error) {
      req.user = null;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

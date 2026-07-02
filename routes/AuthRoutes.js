import express from "express";
import { adminSignup, login, signup } from "../controllers/AuthController.js";
import { signupValidation } from "../middleware/AuthValidation.js";

const authRouter = express.Router();

authRouter.post("/signup", signupValidation, signup);
authRouter.post("/admin/signup", signupValidation, adminSignup);
authRouter.post("/login", login);

export default authRouter;

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import "./DB/db.js";
import authRouter from "./routes/AuthRoutes.js";
import shopRouter from "./routes/ShopRoutes.js";
import pageRouter from "./routes/PageRoutes.js";
import cookieParser from "cookie-parser";
import expressLayouts from "express-ejs-layouts";

const app = express();
const PORT = process.env.PORT;
// recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// static files
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.set("layout", "layout");
// set ejs
app.set("view engine", "ejs");

app.use("/", pageRouter);
app.use("/api/auth", authRouter);
app.use("/api/shop", shopRouter);
app.get("/profile", (req, res) => {  
  res.render("profile");
});


app.listen(PORT, () => {
  console.log("Server running on port 3000");
});

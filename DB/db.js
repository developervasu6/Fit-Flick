import mongoose from "mongoose";

const Db_URI = process.env.DB_CONN_URI;

mongoose
  .connect(Db_URI)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log("Failed to connect to Database, Error: ", err);
  });

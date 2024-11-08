import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();

const app = express();

// make the api see json files
app.use(express.json());

const myport = process.env.PORT || 6007;
const db = process.env.DATABASE_URL;


app.get("/", function (req, res) {
  res.send("Hello World jdjdijiudiudiu");
});

// our own routes
app.use("/auth", authRoutes);

// this is the nmongo db connection
mongoose
  .connect(db)
  .then(() => {
    console.log("database connected successfully");
    app.listen(myport, () => {
      console.log(`listening to port ${myport}`);
    });
  })
  .catch(() => {
    console.log("Database did not connect..");
  });

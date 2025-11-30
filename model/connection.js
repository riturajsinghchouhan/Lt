import mongoose from "mongoose";

const url = "mongodb://localhost:27017/bakemeblush";

mongoose.connect(url);

console.log("Database connected successfully");
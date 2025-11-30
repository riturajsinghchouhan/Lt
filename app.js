import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

dotenv.config();

import "./model/connection.js";

const app = express();

// Middleware;
app.use(cors({
  origin: "https://vercel-frontend-sigma-ten.vercel.app",
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

// Static uploads
app.use("/uploads", express.static(process.env.UPLOAD_PATH));

// Routes
import distanceRouter from "./router/distanceRoute.js";
import userRouter from "./router/user.router.js";
import categoryRouter from "./router/category.router.js";
import subcategoryRouter from "./router/subcategory.router.js";
import orderRoutes from "./router/order_routes.js";
import contactRoutes from "./router/contact_routes.js";
import adRouter from "./router/ad.router.js";
import customCakeRouter from "./router/customCakeRoutes.js";
import notificationRouter from "./router/notifiaction_routes.js"
app.use("/distance", distanceRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/order", orderRoutes);
app.use("/contact", contactRoutes);
app.use("/ads", adRouter);
app.use("/customcake", customCakeRouter);
app.use("/notifications", notificationRouter);
// Default route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});

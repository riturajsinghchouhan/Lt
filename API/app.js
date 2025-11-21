import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import distanceRouter from "./router/distanceRoute.js";
app.use("/distance", distanceRouter);

// Enable file upload (only ONCE, with options)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routers
import userRouter from "./router/user.router.js";
import categoryRouter from "./router/category.router.js";
import subcategoryRouter from "./router/subcategory.router.js";
import orderRoutes from "./router/order_routes.js";
import contactRoutes from "./router/contact_routes.js";
import adRouter from "./router/ad.router.js";
import customCakeRouter from "./router/customCakeRoutes.js";

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/order", orderRoutes);
app.use("/contact", contactRoutes);
app.use("/ads", adRouter);
app.use("/customcake", customCakeRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Start server
app.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});

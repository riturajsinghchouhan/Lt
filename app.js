import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();

import "./model/connection.js";

const app = express();

/* ---------------------------------------------------
   ⭐ CORS FIX (Final + Correct)
------------------------------------------------------ */
app.use(
  cors({
    origin: [
      "https://vercel-frontend-sigma-ten.vercel.app", // your deployed frontend
      "http://localhost:3000", // local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ⭐ Preflight request (OPTIONS)
app.options("*", cors());

/* ---------------------------------------------------
   ⭐ Middleware
------------------------------------------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------------------------------------------
   ⭐ File Upload (Render supports this)
------------------------------------------------------ */
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

/* ---------------------------------------------------
   ⭐ Serve Static Uploads Folder
------------------------------------------------------ */
app.use("/uploads", express.static("uploads"));

/* ---------------------------------------------------
   ⭐ Routes
------------------------------------------------------ */
import distanceRouter from "./router/distanceRoute.js";
import userRouter from "./router/user.router.js";
import categoryRouter from "./router/category.router.js";
import subcategoryRouter from "./router/subcategory.router.js";
import orderRoutes from "./router/order_routes.js";
import contactRoutes from "./router/contact_routes.js";
import adRouter from "./router/ad.router.js";
import customCakeRouter from "./router/customCakeRoutes.js";
import notificationRouter from "./router/notifiaction_routes.js";

app.use("/distance", distanceRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/order", orderRoutes);
app.use("/contact", contactRoutes);
app.use("/ads", adRouter);
app.use("/customcake", customCakeRouter);
app.use("/notifications", notificationRouter);

/* ---------------------------------------------------
   ⭐ Default Route
------------------------------------------------------ */
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Backend is running on Render + Vercel",
  });
});

/* ---------------------------------------------------
   ⭐ Export for Render
------------------------------------------------------ */
export default app;

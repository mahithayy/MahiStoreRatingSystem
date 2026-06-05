const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const storeRoutes = require("./routes/store.routes");
const app = express();
app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173", // Allow local Vite testing
  "https://mahi-store-rating-system.vercel.app"
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // OR if the origin is in our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //This allows cookies to be sent cross-origin
}));
app.use(cookieParser());
app.use(express.json());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api", apiLimiter);
app.use("/api/store", storeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);


app.use((err, req, res, next) => {
  console.error("Error Caught:", err);

  // Handle Zod Validation Errors cleanly
  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Validation Error",
      // Maps over Zod's error array to give a clear list of what went wrong
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Handle standard errors (or fallback to 500 Internal Server Error)
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
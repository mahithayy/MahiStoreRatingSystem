const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const storeRoutes = require("./routes/store.routes");
const app = express();

app.use(cors());
app.use(express.json());
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
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* ================= GLOBAL MIDDLEWARE ================= */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/donations",require("./routes/donationRoutes"))

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */
app.use("/api/ngos", require("./routes/ngoRoutes"));

/* 🔥 ADD THIS LINE FOR CAMPAIGNS */
app.use("/api/campaigns", require("./routes/campaignRoutes"));

app.use("/api/bills",require("./routes/billRoutes"))

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({ message: "HelpChain backend is running 🚀" });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ================= DATABASE + SERVER START ================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Campaign = require("../models/Campaign");

const router = express.Router();

/* ===== Multer Config ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ===== CREATE CAMPAIGN ===== */
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { title, description, targetAmount, ngoId } = req.body;

    if (!title || !description || !targetAmount || !ngoId || !req.file) {
      return res.status(400).json({ message: "All fields required" });
    }

    const campaign = new Campaign({
      title,
      description,
      targetAmount,
      ngoId,
      image: req.file.filename,
    });

    await campaign.save();

    res.status(201).json({
      message: "Campaign created successfully",
      campaign,
    });
  } catch (err) {
    console.error("CREATE CAMPAIGN ERROR:", err);
    res.status(500).json({ message: "Error creating campaign" });
  }
});

/* ===== GET ALL CAMPAIGNS ===== */
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ===== DELETE CAMPAIGN ===== */
router.delete("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // 🔥 Delete image file from uploads folder
    const imagePath = path.join(
      __dirname,
      "../uploads",
      campaign.image
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Campaign.findByIdAndDelete(req.params.id);

    res.json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const Ngo = require("../models/Ngo");

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ================= REGISTER NGO ================= */
router.post(
  "/register",
  upload.fields([
    { name: "document", maxCount: 1 },
    { name: "photos", maxCount: 4 },
  ]),
  async (req, res) =>  {
    try {
      const { name, email, registrationNumber, password, type, address } =
        req.body;

      if (!name || !registrationNumber || !password || !type || !address) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }

      if (!req.files?.document) {
        return res.status(400).json({ message: "Document required" });
      }

      const existingNGO = await Ngo.findOne({ registrationNumber });
      if (existingNGO) {
        return res
          .status(400)
          .json({ message: "NGO already registered" });
      }
      
const existingEmail = await Ngo.findOne({ email });

if (existingEmail) {
  return res.status(400).json({ message: "Email already exists" });
}

      const hashedPassword = await bcrypt.hash(password, 10);

      const photos = req.files.photos
        ? req.files.photos.map((f) => f.filename)
        : [];

      const ngo = new Ngo({
        name,
        email: email || "",
        registrationNumber,
        password: hashedPassword,
        type,
        address,
        document: req.files.document[0].filename,
        photos,
        status: "pending",
      });

      await ngo.save();

     res.status(201).json({
  message: "NGO registered. Waiting for admin approval.",
  ngo,  
});
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= NGO LOGIN (FIXED) ================= */
router.post("/login", async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;

    const ngo = await Ngo.findOne({ registrationNumber });
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ LOGIN ALLOWED EVEN IF BLOCKED
    res.json({
      message:
        ngo.status === "approved"
          ? "Login successful"
          : "Login successful. Approval pending or blocked.",
      ngo,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE NGO PROFILE ================= */
router.put(
  "/update-profile/:id",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.file) updateData.profileImage = req.file.filename;

      const ngo = await Ngo.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!ngo)
        return res.status(404).json({ message: "NGO not found" });

      res.json({ message: "Profile updated successfully", ngo });
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= ADMIN ROUTES ================= */
router.get("/pending", async (req, res) => {
  const ngos = await Ngo.find({
    status: "pending",
    isBlocked: false,
    reverifyRequested: false,
  });
  res.json(ngos);
});

router.get("/approved", async (req, res) => {
  const ngos = await Ngo.find({ status: "approved", isBlocked: false });
  res.json(ngos);
});

router.get("/blocked", async (req, res) => {
  const ngos = await Ngo.find({ isBlocked: true });
  res.json(ngos);
});

router.put("/approve/:id", async (req, res) => {
  const ngo = await Ngo.findByIdAndUpdate(
    req.params.id,
    {
      status: "approved",
      isBlocked: false,
      blockReason: "",
      reverifyRequested: false,
      reverifyMessage: "",
    },
    { new: true }
  );
  res.json({ message: "NGO approved", ngo });
});

router.put("/block/:id", async (req, res) => {
  const { reason } = req.body;
  const ngo = await Ngo.findByIdAndUpdate(
    req.params.id,
    { isBlocked: true, blockReason: reason, status: "rejected" },
    { new: true }
  );
  res.json({ message: "NGO blocked", ngo });
});

router.put("/unblock/:id", async (req, res) => {
  const ngo = await Ngo.findByIdAndUpdate(
    req.params.id,
    {
      isBlocked: false,
      blockReason: "",
      status: "approved",
      reverifyRequested: false,
      reverifyMessage: "",
    },
    { new: true }
  );
  res.json({ message: "NGO unblocked", ngo });
});

router.put("/reverify/:id", async (req, res) => {
  const { message } = req.body;
  const ngo = await Ngo.findByIdAndUpdate(
    req.params.id,
    { reverifyRequested: true, reverifyMessage: message || "" },
    { new: true }
  );
  res.json({ message: "Reverify request sent", ngo });
});

router.put(
  "/reupload/:id",
  upload.single("document"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Document required" });
    }

    const ngo = await Ngo.findByIdAndUpdate(
      req.params.id,
      {
        document: req.file.filename,
        status: "pending",
        rejectionReason: "",
        reverifyRequested: false,
        isBlocked: false,
        blockReason: "",
      },
      { new: true }
    );
    res.json({ message: "Document re-uploaded", ngo });
  }
);

router.get("/:id", async (req, res) => {
  const ngo = await Ngo.findById(req.params.id).select("-password");
  res.json(ngo);
});

module.exports = router;

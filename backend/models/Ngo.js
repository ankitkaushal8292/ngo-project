const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    /* ================= BASIC DETAILS ================= */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    // 📄 registration proof
    document: {
      type: String,
      required: true,
    },

    /* ================= NGO WORK PHOTOS ================= */
    // 🔥 NEW: NGO ke area / activities ki photos
    photos: {
      type: [String],
      default: [],
    },

    /* ================= PROFILE ================= */
    profileImage: {
      type: String,
      default: "",
    },

    /* ================= STATUS FLOW ================= */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    /* ================= ADMIN → NGO MESSAGES ================= */
    rejectionReason: {
      type: String,
      default: "",
    },

    /* ================= BLOCK / FRAUD SYSTEM ================= */
    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    blockReason: {
      type: String,
      default: "",
    },

    /* ================= RE-VERIFICATION SYSTEM ================= */
    reverifyRequested: {
      type: Boolean,
      default: false,
      index: true,
    },

    reverifyMessage: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ngo", ngoSchema);

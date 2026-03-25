const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    targetAmount: {
      type: Number,
      required: true,
    },

    /* 🔥 Total Raised Amount */
    raisedAmount: {
      type: Number,
      default: 0,
    },

    /* 🔥 Number of donors */
    donorCount: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    /* 🔥 Campaign Status */
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },

    /* 🔥 NGO Reference */
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ngo",
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
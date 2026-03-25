const express = require("express");
const router = express.Router();

const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");   // ⭐ ADD THIS


/* ================= DONATE ================= */

router.post("/donate", async (req, res) => {

  try{

  const { amount, campaignId, ngoId } = req.body;

  /* Save Donation */

  const donation = new Donation({
    amount,
    campaignId,
    ngoId
  });

  await donation.save();


  /* ⭐ UPDATE CAMPAIGN RAISED AMOUNT */

  const campaign = await Campaign.findById(campaignId);

  if(campaign){
    campaign.raisedAmount += Number(amount);
    campaign.donorCount += 1;

    await campaign.save();
  }


  res.json({
    message: "Donation successful"
  });

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:"Donation failed"
    })

  }

});


/* ================= NGO DONATIONS ================= */

router.get("/ngo/:ngoId", async (req, res) => {

  try{

  const donations = await Donation.find({
    ngoId: req.params.ngoId
  });

  res.json(donations);

  }catch(err){

    res.status(500).json({
      message:"Error fetching donations"
    })

  }

});

module.exports = router;
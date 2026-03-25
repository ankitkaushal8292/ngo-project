const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({

 donorName:{
   type:String,
   default:"Anonymous"
 },

 donorEmail:{
   type:String
 },

 amount:{
   type:Number,
   required:true
 },

 /* 🔥 Proper Reference */
 campaignId:{
   type: mongoose.Schema.Types.ObjectId,
   ref:"Campaign",
   required:true
 },

 ngoId:{
   type: mongoose.Schema.Types.ObjectId,
   ref:"Ngo",
   required:true
 },

 createdAt:{
   type:Date,
   default:Date.now
 }

})

module.exports = mongoose.model("Donation",donationSchema)
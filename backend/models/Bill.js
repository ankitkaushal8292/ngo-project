const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({

 campaignId:{
 type: mongoose.Schema.Types.ObjectId,
 ref:"Campaign"
 },

 ngoId:{
 type: mongoose.Schema.Types.ObjectId,
 ref:"Ngo"
 },

 image:{
 type:String
 },

 status:{
 type:String,
 enum:["pending","approved","rejected"],
 default:"pending"
 },

 createdAt:{
 type:Date,
 default:Date.now
 }

})

module.exports = mongoose.model("Bill",billSchema)
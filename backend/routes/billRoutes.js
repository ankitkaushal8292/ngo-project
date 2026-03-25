const express = require("express")
const router = express.Router()

const multer = require("multer")
const Bill = require("../models/Bill")

/* Upload config */

const storage = multer.diskStorage({
 destination:(req,file,cb)=>{
 cb(null,"uploads/")
 },
 filename:(req,file,cb)=>{
 cb(null,Date.now()+"-"+file.originalname)
 }
})

const upload = multer({storage})

/* NGO Upload Bill */

router.post("/upload",upload.single("bill"),async(req,res)=>{

 const {campaignId,ngoId} = req.body

 const bill = new Bill({
 campaignId,
 ngoId,
 image:req.file.filename
 })

 await bill.save()

 res.json({message:"Bill uploaded"})
})

/* Admin Get Bills */

router.get("/",async(req,res)=>{

 const bills = await Bill.find()

 res.json(bills)

})

/* Admin Approve */

router.put("/approve/:id",async(req,res)=>{

 await Bill.findByIdAndUpdate(req.params.id,{
 status:"approved"
 })

 res.json({message:"Bill approved"})
})

module.exports = router
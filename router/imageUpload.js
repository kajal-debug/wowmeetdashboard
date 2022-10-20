const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Meeting = require('../models/Meeting');
const gravatar = require('gravatar');
const multer = require('multer');
const { response } = require('express');
const Storage = multer.diskStorage({
    destination:'image',
    filename:(req,file,cb)=>{
       cb(null,Date.now()+file.originalname) 
    }
})
const upload = multer({
    storage:Storage
}).single('img');
router.post('/upload',(req,res)=>{
    console.log("axios.post",req.body.file,req.body.Id)
    upload(req,res,(err)=>{
        console.log("axios.post",req.body.file,req.body.Id)
        if(err){
            res.status(401).json({ error: "not upladed" ,err:err})
        }else{

        let image =Meeting.updateOne({_id:req.body.Id},{$set: {
                file:req.body.file
               }}
               ,function(err,response){
                if(err){
                    res.status(401).json({ error: "upladed" ,err:err})
                }else{
                    res.status(200).json({ msg: "successfully upladed" ,res:response})
                }
               }
               )
        }
    })
})
module.exports = router;
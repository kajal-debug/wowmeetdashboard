const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
// const Meeting = require('../models/Meeting');
const gravatar = require('gravatar');
const multer = require('multer');
const { response } = require('express');
const Storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./config/image')
    },
    filename:(req,file,cb)=>{
       cb(null,req.query.name+file.originalname) 
    }
})
const upload = multer({
    storage:Storage
}).array('images', 3);
router.post('/upload',(req,res)=>{
    console.log("axios.post",req.param,req)
    upload(req,res,(err)=>{
        console.log("axios.post",req.files,req.query.name)
        if(err){
            res.status(401).json({ error: "not upladed" ,err:err})
        }else{
            //  req.flash('sucess',req.file.fieldname);
            //  res.redirect("./config/image");
   res.status(200).json({ msg: 'Successfully fetch data',file:req.files });
        // let image =Meeting.updateOne({_id:req.body.Id},{$set: {
        //         file:req.body.file
        //        }}
        //        ,function(err,response){
        //         if(err){
        //             res.status(401).json({ error: "upladed" ,err:err})
        //         }else{
        //             res.status(200).json({ msg: "successfully upladed" ,res:response})
        //         }
        //        }
        //        )
        }
    })
})
module.exports = router;
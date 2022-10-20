const express = require('express');
// const Meeting = require('../models/Meeting')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const Comapny = require('../models/Company');
const User = require('../models/User');


 router.post('/approve',[],async function(req,res){
  console.log("response0",req.body)
  let data = User.updateOne({email:req.body.email},{$set: {
      status:"approved"
   }},function(err,response){
    if(err){
      res.status(401).json({ error: "upladed" ,err:err})
    }else{
      res.status(200).json({ msg: "successfully upladed" ,res:response})
    }
  });
});
  //console.log("response==",data.result)
module.exports = router;
const express = require('express');
const Meeting = require('../models/Metting')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const Comapny = require('../models/Company');
const User = require('../models/User');
router.get('/superadmin',[],async function(req,response){
// let data = User.find().then((result)=>{
//    // console.log("result++",result)
//    user = user.push(result);
//     response.status(200).json({ msg: 'Successfully fetch data', data:result });
//     return result;
// }).catch((err)=>{
//     response.status(404).json({msg:"something went worng" , err:err})
// })
// let company =Comapny.find().then((result)=>{
//    // console.log("result++",result)
//     response.status(200).json({ msg: 'Successfully fetch data', company:result });
// }).catch((err)=>{
//     response.status(404).json({msg:"something went worng" , err:err})
// })
// console.log("response==",data.result)
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("WOW-EXP");
  dbo.collection('companies').aggregate([
    { $lookup:
      {
        from: 'users',
        localField: 'company_id', 
        foreignField: 'companyid',
        as: 'userdetails'
      }
    }
  ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(JSON.stringify(res));
    response.status(200).json({ msg: 'Successfully fetch data', data:res })
  });
});
// let user =  User.find().populate('companydetails').exec(function(err, docs) {
//   if(err) {response.status(404).json({msg:"something went worng" , err:err})}
//   else{
//     console.log("docs",docs)
//     response.status(200).json({ msg: 'Successfully fetch data', data:docs })
//   }
// });
 });
 router.post('/',[body('company_id').notEmpty().withMessage('company_id is Required')],async function(req,response){
  // let data = User.find().then((result)=>{
  //    // console.log("result++",result)
  //    user = user.push(result);
  //     response.status(200).json({ msg: 'Successfully fetch data', data:result });
  //     return result;
  // }).catch((err)=>{
  //     response.status(404).json({msg:"something went worng" , err:err})
  // })
  console.log("hii usersss",req.body);
  let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: {msg:"please fill the requrement"}  })
    }
    console.log("company_id",req.body,req.query.company_id)
  let company = Comapny.findOne({ company_id: req.body.company_id}).then(async(result)=>{
console.log("result",result.company_id)
 let user = await User.find({ companyid: result.company_id });
    if (!user) {
        return response.status(401).json({ errors: { msg: 'companyid Invalid Credentials' }})
    }
      response.status(200).json({ msg: 'Successfully fetch data', users:user,company:result.companyname});
    
    // response.status(200).json({ msg: 'Successfully fetch data', company:result });
  }).catch((err)=>{

    response.status(404).json({msg:"id miss match" , err:err})
  })
  // if(!company){

  // }else{

  // }
  // console.log("response==",data.result)
  // var MongoClient = require('mongodb').MongoClient;
  // var url = "mongodb://127.0.0.1:27017/";
  
  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("WOW-EXP");
  //   dbo.collection('companies').aggregate([
  //     { $lookup:
  //       {
  //         from: 'users',
  //         localField: 'company_id', 
  //         foreignField: 'companyid',
  //         as: 'userdetails'
  //       }
  //     }
  //   ]).toArray(function(err, res) {
  //     if (err) throw err;
  //     console.log(JSON.stringify(res));
  //     response.status(200).json({ msg: 'Successfully fetch data', data:res })
  //   });
  // });
  // let user =  User.find().populate('companydetails').exec(function(err, docs) {
  //   if(err) {response.status(404).json({msg:"something went worng" , err:err})}
  //   else{
  //     console.log("docs",docs)
  //     response.status(200).json({ msg: 'Successfully fetch data', data:docs })
  //   }
  // });
   });
 router.get('/admindashboard',[],async function(req,response){
  let data = Meeting.find().then(async(result)=>{
      console.log("result++",result)
    await  response.status(200).json({ msg: 'Successfully fetch data', data:result });
      return result;
  }).catch(async(err)=>{
    console.log("err",err)
      await response.status(404).json({msg:"something went worng" , err:err})
  })
  //console.log("response==",data.result)
   });
module.exports = router;
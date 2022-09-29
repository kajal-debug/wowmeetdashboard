const express = require('express');
const app = express();
const http = require('http').Server(app);
//const io = require('socket.io')(http);
const router = express.Router();
//const { body, validationResult } = require('express-validator');
const Sequence = require('../models/Sequence');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const {fs} = require('fs');
const Company = require('../models/Company');
const Sequency = require('../models/Sequence');
/*
    @usage : Register a User
    @url : /api/users/register
    @fields : name , email , password
    @method : POST
    @access : PUBLIC
 */
router.post('/sequence', [
  
], async function(req,response){
    let data = Company.find().then((result)=>{
      //  console.log("result++",result)
        response.status(200).json({ msg: 'Successfully fetch data', data:result }); 
          // var lastindex = result.slice(-1)
          // console.log("lastindex",lastindex)
        //   if(result.length-1){
            result.slice(-1).map(async(item)=>{
                console.log("item**",item)
                if(item){
                   let user = new Sequency({lastsequencenumber:item.company_id,sequencename:"companies",companyname:item.companyname});
           user = await user.save(); 
                }else{
                    console.log("err")
                }
            })
           
        // }
      
    }).catch((err)=>{
        response.status(404).json({msg:"something went worng" , err:err})
    })
    console.log("response",data)
    })
module.exports = router;
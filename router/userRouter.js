const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var  nodemailer = require('nodemailer');

router.post('/UserRegistation', [
    body('name').notEmpty().withMessage('Name is Required'),
    body('email').notEmpty().withMessage('Email is Required'),
   body('password').notEmpty().withMessage('Password is Required'),
    body('companyid').notEmpty().withMessage('companyid is Required'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log("data frm froted err")
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        console.log("data frm froted")
        let { name, email,companyid,password,isAdmin } = request.body;
        console.log("data frm froted",name, email,companyid,password,isAdmin)
        // check if the user is exists
        let user = await User.findOne({ email: email });
        console.log("user48",user)
        if (user) {
            if(user.status==='register'){
                         var transporter= nodemailer.createTransport({
                        // host: "smtp.ethereal.email",
                       //  port: 587,
                       //  secure: false, // true for 465, false for other ports
                       host: 'smtp.gmail.com',
                      // port: 465,
                      port:587,
                       //secure: true, 
                       // service:"gmail",
                         auth: {
                           user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                         //  pass: "Kajalb@96", // generated ethereal password
                           pass:"kootqycpxohqbsaz"
                         },
                     });
                     var mailOption={
                         from:'kajalbaisakh7@gmail.com',
                         to:'kajalbaisakh123@gmail.com',
                         subject:"mail for register Approval for the company",
                         text:"Comapny approval",
                         html:`<p style="color:black,font-weight:bold">Client is waiting for the approval ${request.body.name} Comapny.please keep on touch.</p>`
                     }
                     transporter.sendMail(mailOption,function(err,info){
                         if(err){
                             console.log(err);
                         }else{
                             console.log("email has been send",info.response);
                             const data = async()=>{
                                console.log("update one")
                                await User.updateOne({_id:user.id},{$set: {
                                    status:"approved"
                                   }})
                                   console.log("id",user.id)
                             }
                              data();
                         }
                     })
            }
            return response.status(401).json({ errors: [{ msg: 'User is Already Exists' ,user:user}] });
        }
        // console.log("user52",user)
        else{
            console.log("sending email")
                            const Companyuser=   async()=>{
                                console.log("store to the db")
                                const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt)
            var comnyidd,company_id;
            const no = await User.find().then((item)=>{
                console.log("item",item)
                item.map((id)=>{console.log("uuid",id.sequence_id,id.companyid,companyid)
                if(companyid!==id.companyid){
                    company_id=companyid
                }else{
                    return response.status(401).json({ errors: [{ msg: 'give unique id , id already exists' ,user:user}] });
                }
                if (id.sequence_id< 0){
                    const str =  id.sequence_id + 1
                    const pad = "0000"
                    const answer =  str;
                    console.log("answer",answer)
                    comnyidd = answer;
                    return comnyidd = answer;
                  }else{
                    console.log("error")
                  }})

            })
               
                console.log("no",comnyidd,company_id)
            user = new User({ name, email,companyid:companyid,password,isAdmin,sequence_id:comnyidd?comnyidd:1});
            user = await user.save();
             response.status(200).json({ msg: 'Registration is Success' }); 
                             }
                              
                             Companyuser();
                             if(response.status(200)){
            var transporter= nodemailer.createTransport({
               // host: "smtp.ethereal.email",
              //  port: 587,
              //  secure: false, // true for 465, false for other ports
              host: 'smtp.gmail.com',
             // port: 465,
             port:587,
              //secure: true,
              // service:"gmail",
                auth: {
                  user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                //  pass: "Kajalb@96", // generated ethereal password
                  pass:"kootqycpxohqbsaz"
                },
            });
            var mailOption={
                from:'kajalbaisakh7@gmail.com',
                to:'kajalbaisakh123@gmail.com',
                subject:"mail for register conformation",
                text:"you are waiting for the approval please keep on touch. Wait for 24hours.anny issue contact",
                html:`<p style="color:black,font-weight:bold">you are waiting for the approval please keep on touch. Wait for 24hours.anny issue contact</p>`
            }
            transporter.sendMail(mailOption,function(err,info){
                if(err){
                    console.log("err for:",err);

                }else{
                    console.log("email has been send",info.response);
                    var transporter= nodemailer.createTransport({
                        // host: "smtp.ethereal.email",
                       //  port: 587,
                       //  secure: false, // true for 465, false for other ports
                       host: 'smtp.gmail.com',
                      // port: 465,
                      port:587,
                       //secure: true,
                       // service:"gmail",
                         auth: {
                           user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                         //  pass: "Kajalb@96", // generated ethereal password
                           pass:"kootqycpxohqbsaz"
                         },
                     });
                     var mailOption={
                         from:'kajalbaisakh7@gmail.com',
                         to:'kajalbaisakh123@gmail.com',
                         subject:"mail for register Approval for the company",
                         text:"Comapny approval",
                         html:`<p style="color:black,font-weight:bold">Client is waiting for the approval ${request.body.companyname} Comapny.please keep on touch.</p>`
                     }
                     transporter.sendMail(mailOption,function(err,info){
                         if(err){
                             console.log(err);
                         }else{
                             console.log("email has been send",info.response);
                         }
                     })
                    
                }
            })
            // const salt = await bcrypt.genSalt(10);
            // password = await bcrypt.hash(password, salt)
            // user = new User({ name, email, password });
            // user = await user.save();
            //  response.status(200).json({ msg: 'Registration is Success' });
         }
        }
       
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
}

);
router.post('/profile',[body('_id').notEmpty().withMessage(' _id is Required')],async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let {_id,name,password,companyid} = request.body;
       // console.log("data frm froted",Mettingname,new Date().getTime())
        let profile = await User.findOne({ _id: _id });
        if (profile) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt)
                console.log("_id",_id,name,password,companyid)

              profile = User.updateMany({_id: _id},{$set: {name:name,password:password,companyid:companyid}} , function(err, res) {
                if (err) {
                    return response.status(401).json({ errors: "something is not valid" })
                }
                else{
                    response.status(200).json({ msg: 'user updated  Successfully ',res:res }); 
                }
              });
           }
        else{
            return response.status(401).json({ errors: [{ msg: 'user is not exit' ,profile:profile}] });
                             }         
        }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
})
module.exports = router;
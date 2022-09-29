const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
var  nodemailer = require('nodemailer');

router.post('/CompanyRegistraion', [
    body('companyname').notEmpty().withMessage('comapnyName is Required'),
    body('email').notEmpty().withMessage('Email is Required'),
    body('password').notEmpty().withMessage('Password is Required'),
    body('adminname').notEmpty().withMessage('adminName is Required'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let { companyname, email,adminname,password,isAdmin} = request.body;
        console.log("data frm froted",companyname, email,adminname,password,isAdmin)

        // check if the user is exists
        let user = await Company.findOne({ email: email });
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
                         html:`<p style="color:black,font-weight:bold">Client is waiting for the approval ${request.body.companyname} Comapny.please keep on touch.</p>`
                     }
                     transporter.sendMail(mailOption,function(err,info){
                         if(err){
                             console.log(err);
                         }else{
                             console.log("email has been send",info.response);
                             const data = async()=>{
                                console.log("update one")
                                await Company.updateOne({_id:user.id},{$set: {
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
           var comnyidd;
            const no = await Company.find().then((item)=>{
                console.log("item",item.companyname)
                item.map((id)=>{console.log("uuid",id.company_id)
                console.log("companyname",companyname,id.companyname)
                 if(id.companyname===companyname){
                    if (id.company_id > 0){
                        const str = 
                        id.company_id + 1
                        const pad = "0000"
                        const answer = companyname +str;
                        console.log("answer",answer)
                        comnyidd = answer;
                        return answer;
                      }else{
                        console.log("error")
                      }
                 }
            })
            })
               
                console.log("no",no,comnyidd)
       console.log("save to db",companyname, email,adminname,password,isAdmin,{company_id:comnyidd ? comnyidd:companyname+1})
            user = new Company({companyname, email,adminname,password,isAdmin,company_id:comnyidd ? comnyidd:companyname+1});
            user = await user.save();
             response.status(200).json({ msg: 'Registration is Success' }); 
                             }
                             Companyuser();
                             
        //                      if(response.status(200)){
        //     var transporter= nodemailer.createTransport({
        //        // host: "smtp.ethereal.email",
        //       //  port: 587,
        //       //  secure: false, // true for 465, false for other ports
        //       host: 'smtp.gmail.com',
        //      // port: 465,
        //      port:587,
        //       //secure: true,
        //       // service:"gmail",
        //         auth: {
        //           user: 'kajalbaisakh7@gmail.com', // generated ethereal user
        //         //  pass: "Kajalb@96", // generated ethereal password
        //           pass:"kootqycpxohqbsaz"
        //         },
        //     });
        //     var mailOption={
        //         from:'kajalbaisakh7@gmail.com',
        //         to:'kajalbaisakh123@gmail.com',
        //         subject:"mail for register conformation",
        //         text:"you are waiting for the approval please keep on touch. Wait for 24hours.anny issue contact",
        //         html:`<p style="color:black,font-weight:bold">you are waiting for the approval please keep on touch. Wait for 24hours.anny issue contact</p>`
        //     }
        //     transporter.sendMail(mailOption,function(err,info){
        //         if(err){
        //             console.log("err for:",err);

        //         }else{
        //             console.log("email has been send",info.response);
        //             var transporter= nodemailer.createTransport({
        //                 // host: "smtp.ethereal.email",
        //                //  port: 587,
        //                //  secure: false, // true for 465, false for other ports
        //                host: 'smtp.gmail.com',
        //               // port: 465,
        //               port:587,
        //                //secure: true,
        //                // service:"gmail",
        //                  auth: {
        //                    user: 'kajalbaisakh7@gmail.com', // generated ethereal user
        //                  //  pass: "Kajalb@96", // generated ethereal password
        //                    pass:"kootqycpxohqbsaz"
        //                  },
        //              });
        //              var mailOption={
        //                  from:'kajalbaisakh7@gmail.com',
        //                  to:'kajalbaisakh123@gmail.com',
        //                  subject:"mail for register Approval for the company",
        //                  text:"Comapny approval",
        //                  html:`<p style="color:black,font-weight:bold">Client is waiting for the approval ${request.body.companyname} Comapny.please keep on touch.</p>`
        //              }
        //              transporter.sendMail(mailOption,function(err,info){
        //                  if(err){
        //                      console.log(err);
        //                  }else{
        //                      console.log("email has been send",info.response);
        //                  }
        //              })
                    
        //         }
        //     })
        //     // const salt = await bcrypt.genSalt(10);
        //     // password = await bcrypt.hash(password, salt)
        //     // user = new User({ name, email, password });
        //     // user = await user.save();
        //     //  response.status(200).json({ msg: 'Registration is Success' });
        //  }
        }
       
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
}

);
module.exports = router;
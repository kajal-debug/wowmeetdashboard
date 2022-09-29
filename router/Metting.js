const express = require('express');
const uuid = require('uuid');
const { body, validationResult } = require('express-validator');
const Metting = require('../models/Metting');
const User = require('../models/User');
const router = express.Router();
router.post('/metting',[body('Mettingname').notEmpty().withMessage(' Mettingname is Required')],async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let {Mettingname ,users,meetingtime,company_id} = request.body;
        console.log("request body",request.body)
        
       // console.log("data frm froted",Mettingname,new Date().getTime())
        let metting = await Metting.findOne({Mettingname:Mettingname});
        if (metting) {
            return response.status(401).json({ errors: [{ msg: 'Metting is Already Exists' ,metting:metting}] });
        }
        else{
            var meeting_id;
            // const no = await Metting.find().then((item)=>{
            //     console.log("item",item)
            //     item.map((id)=>{
            //     if(!id.meetingid){

            //     }else{
            //         return response.status(401).json({ errors: [{ msg: 'give unique id , id already exists' ,metting:metting}] });
            //     }
            //     if (id.meetingid>= 0){
            //         const str = 
            //         id.meetingid + 1
            //         const pad = "0000"
            //         const answer = pad + str;
            //         console.log("answer",answer)
            //         meeting_id = answer;
            //         return answer;
            //       }else{
            //         console.log("error")
            //       }})

            // })
            // const id = uuid.v1().split('').map(item=>{ 
            //     console.log("item",item)
            //     if(item>=0){
            //         const number =item+item
            //        console.log("value",item,"item",item+item[0],"code", number.fromCharCode)
            //     }
            // })
            meeting_id=uuid.v4()
            console.log("mettigId__",meeting_id,uuid.v4())
               metting = new Metting({Mettingname:Mettingname,userId:users,starting: meetingtime,company_id:company_id,meetingid:meeting_id});
                metting = await metting.save();
             response.status(200).json({ msg: 'Metting is Successfully created' ,id:meeting_id}); 
            // console.log("object id",metting._id,metting._id.toHexString(),Buffer.from(metting._id).toString('hex'))
             }         
        }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
}

);

router.post('/fetching/metting',[body('company_id').notEmpty().withMessage(' company_id is Required')],async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let {Mettingname ,users,meetingtime,company_id} = request.body;
        console.log("request body",request.body)
        
       // console.log("data frm froted",Mettingname,new Date().getTime())
        let metting = await Metting.find({company_id:company_id});
        if (metting) {
            let users = await User.find({companyid:company_id});
            return response.status(200).json({ msg: 'Metting is Successfully created' ,metting:metting,user:users}); 
        }
        else{
            return response.status(401).json({ errors: [{ msg: 'Metting is Already Exists' ,metting:metting}] });
           
            
             }         
        }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
}

);

router.post('/update/mettinguser',[body('_id').notEmpty().withMessage('_id is Required')],
async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }

        let {users,_id} = request.body;
        console.log("request body",request.body)
        
       // console.log("data frm froted",Mettingname,new Date().getTime())
       var datanewusers= [];
        let metting = await Metting.find({_id:_id})
        // .then(async(response)=>{
            
        //     response.map((item)=>{
        //         var adduser =item.userId
        //         console.log("backenditem",item.userId,request.body.users)
        //         var newuser = [...adduser,request.body.users]
        //         console.log("newuser",newuser)
        //        return datanewusers = newuser;
        //     })
        //     let users =  await Metting.updateOne({_id:_id},{$set: {
        //         userId:newuser
        //        }},function(err,res){
        //         if(err){
        //             // res.status(401).json({ error: "upladed" ,err:err})
        //         }else{
        //             // res.status(200).json({ msg: "successfully upladed" ,res:response})
        //         }
        //        });
        //     console.log("newuser++",newuser,datanewusers)
        // })
        // console.log("newuser+",datanewusers)
        if (metting) {
            console.log("userId",metting,request.body.users,datanewusers)
            metting.map((item)=>{
                        var adduser =item.userId
                        console.log("backenditem",item.userId,request.body.users)
                        var newuser = [...adduser,request.body.users]
                        console.log("newuser",newuser)
                       return datanewusers = newuser;
                    })
                    console.log("newuser+",datanewusers)
            
            let users =  await Metting.updateOne({_id:_id},{$set: {
                userId:datanewusers
               }},function(err,res){
                if(err){
                    response.status(401).json({ error: "upladed" ,err:err})
                }else{
                    let dataofview=Metting.find({_id:_id}).then((item)=>{
                        console.log("item",item)
                        response.status(200).json({ msg: "successfully upladed",res:item})
                    })
                    console.log("res+++++++",dataofview)
                }
               });
                
        }
}

);

module.exports = router;
const express = require('express');
const { body, validationResult } = require('express-validator');
const Metting = require('../models/Metting');
const Comapny = require('../models/Company');
const router = express.Router();
router.post('/mettingsequence',[body('company_id').notEmpty().withMessage(' company_id is Required'),
body('userId').notEmpty().withMessage('User not invited'),body('Mettingname').notEmpty().withMessage('MeetingName is required')],async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let {Mettingname,userId ,company_id} = request.body;
       // console.log("data frm froted",Mettingname,new Date().getTime())
        let metting = await Comapny.findOne({ company_id: company_id });
        if (metting) {
              //  metting = await metting.save();
              console.log("Mettingname",Mettingname)
            
            //   metting = Metting.updateMany({Mettingname:Mettingname},{$set: {company_id: company_id,userId:userId}} , function(err, res) {
            //     if (err) {
            //         return response.status(401).json({ errors: "Mettingname is not valid" })
            //     }
            //     else{
            //         response.status(200).json({ msg: 'Metting is Successfully created',res:res }); 
            //     }
            //   });
           }
        else{
            return response.status(401).json({ errors: [{ msg: 'Admin is not exit' ,metting:metting}] });
                             }         
        }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
}

);
module.exports = router;
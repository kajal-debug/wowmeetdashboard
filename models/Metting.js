const mongoose = require('mongoose');
//const uuid = require('uuid');
//const crypto = require("crypto");
let MettingSchema = new mongoose.Schema({
   // _id:{default:ObjectId(_id).crypto.randomBytes(16).toString("hex")},
   meetingid:{type:String,unique:true},
   company_id:{type:String,unique:true},
   userId:{type : Array },
    Mettingname : {type : String , required : true},
    duration:{type:String, required:true,default:Math.floor((new Date().getSeconds()%60))+"sec"},
    starting:{type:String, required:true
        // default:new Date().toLocaleTimeString(undefined,{timeZone: 'Asia/Kolkata'})
    },
    file:{type : String , required : true},
    status:{type:String,default:'active'}
}, {timestamps : true});
const Metting = mongoose.model('metting' , MettingSchema);
module.exports = Metting;
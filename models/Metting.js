const mongoose = require('mongoose');
let MeetingSchema = new mongoose.Schema({
   meetingid:{type:String,unique:true},
   company_id:{type:String,unique:true},
   userId:{type : Array },
    Meetingname : {type : String , required : true},
    duration:{type:String, required:true,default:Math.floor((new Date().getSeconds()%60))+"sec"},
    starting:{type:String, required:true
        // default:new Date().toLocaleTimeString(undefined,{timeZone: 'Asia/Kolkata'})
    },
    file:{type : String },
    status:{type:String,default:'active'}
}, {timestamps : true});
const Meeting = mongoose.model('meeting' , MeetingSchema);
module.exports = Meeting;
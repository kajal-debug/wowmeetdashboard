const mongoose = require('mongoose');
const Comapny = require('./Company');
let UserSchema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String },
    password : { type : String , required : true},
    avatar : {data:Buffer,type : String },
    isAdmin : {type : String , required : true},
    companyid : {type : String , required : true},
    sequence_id:{type:Number,unique:true},
    status:{type:String,default:'register'},
    companydetails:{type:mongoose.Schema.Types.ObjectId, ref: Comapny}
}, {timestamps : true});
const User = mongoose.model('user' , UserSchema);
module.exports = User;
const mongoose = require('mongoose');

let ComapnySchema = new mongoose.Schema({
    company_id:{type:String,unique:true},
    companyname : {type : String , required : true},
    email : {type : String , required : true},
    password : {type : String , required : true},
    adminname : {type : String , required : true},
    isAdmin : {type : String , required : true},
    status:{type:String,default:'register'}

}, {timestamps : true});

const Company = mongoose.model('Company' , ComapnySchema);
module.exports = Company;
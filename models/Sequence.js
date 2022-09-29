const mongoose = require('mongoose');

let sequenceSchema = new mongoose.Schema({
   // company_id:{type:Number,unique:true,Autoincrement},
    lastsequencenumber:{type:Number,unique:true},
    sequencename : {type : String , required : true},
    companyname : {type : String , required : true}
}, {timestamps : true});

const Sequence = mongoose.model('Sequence' , sequenceSchema);
module.exports = Sequence;
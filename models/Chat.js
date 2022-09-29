const mongoose = require('mongoose');
let ChatSchema = new mongoose.Schema({
    name : {type : String , required : true}

}, {timestamps : true});

const Chat = mongoose.model('chat' , ChatSchema);
module.exports = Chat;
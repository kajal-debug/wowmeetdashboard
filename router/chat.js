const mongoose = require("mongoose");
const express = require('express');
const {RtcTokenBuilder,RtcRole}= require('agora-access-token');
const APP_CERTIFICATE = 'chat';
// const nocache = (req,res,next)=>{
//     console.log("response from frontend 11",req.body,req.body.channelName)
//     res.header('Cache-Control','private,no-cache,no-store,must-revalidate');
//     res.header('Expires','-1');
//     res.header('Pragma','no-cache');
//     next();
// }
const generateAccessToken=(req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    const channelName = req.query.channelName;
    const APP_ID = req.query.APP_ID;
    console.log("response from frontend__",req.query)
    if(!channelName){
        return res.status(500).json({'error':"channel is required"})
    }
    let uid = req.query.uid;
    if(!uid || uid == ''){
        uid = req.query.uid;
    }
    let role = RtcRole.SUBSCRIBER;
    if(req.query.role == 'publisher'){
        role = RtcRole.PUBLISHER;
    }
    let expireTimer = req.query.expireTimer;
    if(!expireTimer || expireTimer == ''){
        expireTimer ='24h';
    } else{
        expireTimer = parseInt(expireTimer, 10);
    }
    const currentTime = Math.floor(Date.now()/1000);
    const privilegeExpireTime = currentTime + expireTimer;
    const token =RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName,uid,role,privilegeExpireTime);
    return res.json({'token':token});
}
module.exports = generateAccessToken;
// const expessroute = express();
// const router = express.Router();
// const { body, validationResult } = require('express-validator');
// var http = require('http');
// const Chat = require('../models/Chat');
// const socketio = require('socket.io')(http);
// //const server = http.createServer(expessroute);
// //const io = socketio(server)

// const cors = require("cors");9* 
// router.post('/', (req,res) => {
// //     res.send('welcome to chat box')
//    // console.log("outter of outter function");
//     socketio.on('connection',(socket)=>{
//    //  let chat = Chat;
//    console.log("outter function");
//    res.send('welcome to outer chat box')
//      sendStatus = function(s,err){
//         socket.emit("sender value",s);
//         console.log("err",err)
//      }
//      Chat.find().limit(100).sort().toArray(function(err,res){
//         if(err){
//             throw err;
//         }
//         socket.on('input',function(response){
//             let name = response.name;
//             let message = response.message;

//             if(name ==''){

//                 sendStatus('please enter name')
//             }else{
//                 Chat.insert({name:name},function(){
//                     io.emit('output',[response])
//                     sendStatus({
//                         message:'message sent',
//                         clear:true
//                     })
//                     scoket.on('clear',function(data){
//                         Chat.remove({},function(){
//                             socket.emit('cleared');
//                         })
//                     })
//                 })
//             }
//         })
//         socket.emit("sender value",res);
//      }) 
//     })
//     console.log("not valiable function");
// })

// module.exports = router;
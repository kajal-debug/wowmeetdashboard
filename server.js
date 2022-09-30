const express = require("express");
const app = express();
const server = require('http')
const http = server.createServer(app);
const cors = require("cors");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const agoratoken = require("./router/chat");
const {RtcTokenuilder,RtcRole}= require('agora-access-token');
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const fs = require("fs");
// const io = require('socket.io').listen(http
//   //  {
//   // cors: {
//   //   origin: "http://localhost:5000",
//   //   methods: ["GET", "POST"]
//   // }

// );
const Path = require('path');
const router = express.Router();
const Chat = require('./models/User');
// const server = http.createServer(app);
// const io = socketio(server)49;
// const mongoose = require('mongodb').MongoClient;
// configure cors
app.use(cors());
// app.use((req,res,next)=>{
//   res.setHeader('Access-Control-Allow-Origin','*');
//   res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//   res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
//   next(); 
// })
// configure express to receive form data
app.use(express.json());

// configure dotEnv
dotEnv.config({ path: "./.env" });

const port = process.env.PORT || 5000;
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
const db = 'mongodb+srv://wowexp:kajal123@cluster0.rs8w5i5.mongodb.net/wowexp?retryWrites=true&w=majority'
mongoose.connect( db||process.env.MONGO_DB_LOCAL_URL, 
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
   useCreateIndex: true,
  })
  .then((response) => {
    console.log("Connected to MongoDB Cloud Successfully......");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//   fs.readFile('./index.html', function (err, html) {

//     if (err) throw err;    

//     http.createServer(function(request, response) {  
//         response.writeHeader(200, {"Content-Type": "text/html"});  
//         response.write(html);  
//         response.end();  
//     }).listen(port);
// });
//  async()=>{
//   mongoose.connect(process.env.MONGO_DB_LOCAL_URL,{
//   //connectTimeoutMS: 5000,
//  // socketTimeoutMS: 5000,
//         useUnifiedTopology: true,
//         useNewUrlParser: true,
//         // useFindAndModify: false,
//         // useCreateIndex: true,
//       },function(err,db){
//     if(err){
//       throw err;
//     }
//     console.log("Connected to MongoDB Cloud Successfully......")
    
//   });

// }


// simple request
// app.get("/", (request, response) => {
//   response.render('./index');
// });

// router configuration
app.use(express.static("./index.html"))
app.use("/api/users", require("./router/userRouter"));
app.use("/api/fetch_user",require("./router/fetch_user"));
app.use("/api/email",require("./router/mailer"));
app.use("/api",require("./router/sequence"));
app.use("/api",require("./router/Login"));
app.use("/api",require("./router/Metting"));
app.use("/api",require('./router/Meetingsequence'))
app.use("/api",require('./router/imageUpload'));
app.get('/api/chats',require("./router/chat"));
  app.post('/api/chat', (req,res) => {
res.send("welcome")
  console.log("function")
  io.on("connection",socket=>{
    //  let chat = Chat;
    const user = {}
    console.log("outter function");
    console.log(socket.id);
    socket.on('newuserjoin',username=>{
      console.log("outter inner function");
      console.log("new user",username)
      user[socket.id]=username;
        
      console.log("new user___",username) 
      socket.broadcast.emit('user-join',user[socket.id])
      //socket.offAny(username);
    })
    socket.on('send',message=>{
      socket.broadcast.emit('recive',{message:message,name:user[socket.id]})
    })
    socket.on('disconnect',message=>{
    socket.broadcast.emit('left',user[socket.id]);
    delete user[socket.id];
  })
  })
     })
  // io.on('connection',socket=>{
  //   //  let chat = Chat;
  //   console.log("outter function");
  //   socket.on('new-user-join',username=>{
  //     console.log("outter inner function");
  //     console.log("new user",username)
  //     user[socket.id]=username;
  //     socket.broadcast.emit('user-join',username) 
  //   })
  //   socket.on('send',message=>{
  //     socket.broadcast.emit('recive',{message:message,name:user[socket.id]})
  //   })
  // })
// })
const nocache = (req,res,next)=>{
  res.header('Cache-Control','private,no-cache,no-store,must-revalidate');
  res.header('Expires','-1');
  res.header('Pragma','no-cache');
  next();
}
const generateAccessToken=(req,res)=>{
  res.header('Access-Control-Allow-Origin','*');
  const channelName = req.query.channelName;
  if(!channelName){
      return res.status(500).json({'error':"channel is required"})
  }
  let uid = req.query.uid;
  if(!uid || uid == ''){
      uid = 0;
  }
  let role = RtcRole.SUBSCRIBER;
  if(req.query.role == 'publisher'){
      role = RtcRole.PUBLISHER;
  }
  let expireTimer = req.query.expireTimer;
  if(!expireTimer || expireTimer == ''){
      expireTimer =3600;
  } else{
      expireTimer = parseInt(expireTimer, 10);
  }
  const currentTime = Math.floor(Date.now()/1000);
  const privilegeExpireTime = currentTime + expireTimer;
  const token = (APP_ID,APP_CERTIFICATE,channelName,uid,role,privilegeExpireTime);
  return res.json({'token':token});
}
// fs.readFile('./index.html', function (err, html) {

//   if (err) throw err;    

// (request, response) =>{  
//       response.writeHeader(200, {"Content-Type": "text/html"});  
//       response.write(html);  
//       response.end();  
// }
// });
// fs.readFile('./index.html', function (err, html) {

//       if (err) throw err;    
  
//      var servers = server.createServer(function(request, response) {  
//           response.writeHeader(200, {"Content-Type": "text/html"});  
//           response.write(html);  
//           response.end();  
//       }).listen(port);
//       servers.on('error', function (e) {
//         // Handle your error here
//         console.log(e);
//       })
//   });
 
http.listen(port,generateAccessToken, nocache, () => {
  console.log(`Express Server is started at PORT : ${port}`);
});
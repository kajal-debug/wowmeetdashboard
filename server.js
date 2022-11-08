const express = require("express");
const app = express();
const server = require('http')
const http = server.createServer(app);
const cors = require("cors");
const io = require('socket.io')(http);

const dotEnv = require("dotenv");
dotEnv.config({ path: "./.env" });

require("./config/database").connect();

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
// const Chat = require('./models/User');
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

const port = process.env.PORT || 5001;

app.use(express.static(__dirname + '/src'));
// app.use(express.static(__dirname + '/public_html'));
app.use(express.static('./public_html/game/'));
app.use(express.static('./public_html/libs'));


/**Starting file  */
// app.use(express.static(__dirname + "/dashboard/"));

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/dashboard/');
// });

/**
 *  Backend APIs 
 */
app.use("/api", require("./router/registration"));
// app.use("/api/email", require("./router/mailer"));
app.use("/api", require("./router/Login"));
// app.use("/api", require("./router/Login"));
app.use("/api", require("./router/fetchUsers"));
// app.use("/api/fetch_user", require("./router/fetch_user"));
app.use("/api", require("./router/Meeting"));
// app.use("/api", require("./router/Meeting"));
app.use("/api", require("./router/saveNotes"));
app.use("/api", require("./router/fetchMeetingsNotes"));


// app.use("/api/users", require("./router/userRouter"));
// app.use("/api/fetch_user", require("./router/fetch_user"));
// app.use("/api", require("./router/sequence"));
// app.use("/api", require("./router/Meeting"));
// app.use("/api", require('./router/Meetingsequence'))
// app.use("/api", require('./router/imageUpload'));
// app.get('/api/chats', require("./router/chat"));
// app.use('/api', require("./router/approve"));
/**
 * End Backend APIs 
 */

const nocache = (req, res, next) => {
  res.header('Cache-Control', 'private,no-cache,no-store,must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}
const generateAccessToken = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(500).json({ 'error': "channel is required" })
  }
  let uid = req.query.uid;
  if (!uid || uid == '') {
    uid = 0;
  }
  let role = RtcRole.SUBSCRIBER;
  if (req.query.role == 'publisher') {
    role = RtcRole.PUBLISHER;
  }
  let expireTimer = req.query.expireTimer;
  if (!expireTimer || expireTimer == '') {
    expireTimer = 3600;
  } else {
    expireTimer = parseInt(expireTimer, 10);
  }
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTimer;
  const token = (APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
  return res.json({ 'token': token });
}

http.listen(port, generateAccessToken, nocache, () => {
  console.log(`Express Server is started at PORT : ${port}`);
});



io.sockets.on('connection', function (socket) {
  socket.userData = { x: 0, y: 0, z: 0, heading: 0 };//Default values;
// socket connected 

  console.log(`${socket.id} connected`);
  socket.emit('setId', { id: socket.id });

  socket.on('disconnect', function () {
    socket.broadcast.emit('deletePlayer', { id: socket.id });
  });

  socket.on('init', function (data) {
    console.log(`socket.init ${data.playerName}`);
    socket.userData.model = data.model;
    socket.userData.colour = data.colour;
    socket.userData.playerName = data.playerName;

    socket.userData.x = data.x;
    socket.userData.y = data.y;
    socket.userData.z = data.z;
    socket.userData.heading = data.h;
    socket.userData.pb = data.pb;
    socket.userData.action = "Idle";
  });

  socket.on('update', function (data) {
    socket.userData.x = data.x;
    socket.userData.y = data.y;
    socket.userData.z = data.z;
    socket.userData.heading = data.h;
    socket.userData.pb = data.pb;
    socket.userData.action = data.action;
  });

  socket.on('chat message', function (data) {
    console.log(`chat message:${data.id} ${data.message}`);
    io.to(data.id).emit('chat message', { id: socket.id, message: data.message });
  })

  socket.on('name', function (data) {
    console.log(`name:${data.id} ${data.name}`);
    io.to(data.id).emit('name', { id: socket.id, name: data.name });
  })
});

setInterval(function () {
  const nsp = io.of('/');
  let pack = [];

  for (let id in io.sockets.sockets) {
    const socket = nsp.connected[id];
    //Only push sockets that have been initialised
    if (socket.userData.model !== undefined) {
      pack.push({
        id: socket.id,
        model: socket.userData.model,
        colour: socket.userData.colour,
        x: socket.userData.x,
        y: socket.userData.y,
        z: socket.userData.z,
        heading: socket.userData.heading,
        pb: socket.userData.pb,
        action: socket.userData.action
      });
    }
  }
  if (pack.length > 0) io.emit('remoteData', pack);
}, 40);
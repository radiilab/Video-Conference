
const express = require('express')
const ngrok = require('ngrok');
const user = process.env.USER;
const password = process.env.PASSWORD;
require('dotenv').config();
//var cors = require('cors');

var io = require('socket.io')
({
  path: '/io/webrtc'
})

const app = express()
const port =process.env.PORT || 8080


// use it before all route definitions
//app.use(cors({origin: `http://localhost:${port}`}));
// app.get('/', (req, res) => res.send('Hello World!!!!!'))


// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', `http://localhost:${port}`);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// const cors= function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', `http://localhost:${port}`);

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// }
//https://expressjs.com/en/guide/writing-middleware.html
app.use(express.static(__dirname + '/build'))
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/build/index.html')
})
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

ngrok.connect({
  proto : 'http',
  addr : process.env.PORT,
  //auth : `${user}:${password}`
}).then(uri =>{
  console.log('Tunnel Created -> ', uri);
  console.log('Tunnel Inspector ->  http://127.0.0.1:4040');
}).catch(err=>{
  console.error('Error while connecting Ngrok', err);
  console.trace();
  return new Error('Ngrok Failed');
});

io.listen(server)

// default namespace
io.on('connection', socket => {
  console.log('connected')
})

// https://www.tutorialspoint.com/socket.io/socket.io_namespaces.htm
const peers = io.of('/webrtcPeer')

// keep a reference of all socket connections
let connectedPeers = new Map()

peers.on('connection', socket => {

  connectedPeers.set(socket.id, socket)

  console.log(socket.id)
  socket.emit('connection-success', {
    success: socket.id,
    peerCount: connectedPeers.size,
  })

  const broadcast = () => socket.broadcast.emit('joined-peers', {
    peerCount: connectedPeers.size,
  })
  broadcast()

  const disconnectedPeer = (socketID) => socket.broadcast.emit('peer-disconnected', {
    peerCount: connectedPeers.size,
    socketID: socketID
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
    connectedPeers.delete(socket.id)
    disconnectedPeer(socket.id)
  })

  socket.on('onlinePeers', (data) => {
    for (const [socketID, _socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID.local) {
        console.log('online-peer', data.socketID, socketID)
        socket.emit('online-peer', socketID)
      }
    }
  })

  socket.on('offer', data => {
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID === data.socketID.remote) {
        // console.log('Offer', socketID, data.socketID, data.payload.type)
        socket.emit('offer', {
            sdp: data.payload,
            socketID: data.socketID.local
          }
        )
      }
    }
  })

  socket.on('answer', (data) => {
    for (const [socketID, socket] of connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        console.log('Answer', socketID, data.socketID, data.payload.type)
        socket.emit('answer', {
            sdp: data.payload,
            socketID: data.socketID.local
          }
        )
      }
    }
  })

  // socket.on('offerOrAnswer', (data) => {
  //   // send to the other peer(s) if any
  //   for (const [socketID, socket] of connectedPeers.entries()) {
  //     // don't send to self
  //     if (socketID !== data.socketID) {
  //       console.log(socketID, data.payload.type)
  //       socket.emit('offerOrAnswer', data.payload)
  //     }
  //   }
  // })

  socket.on('candidate', (data) => {
    // send candidate to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        socket.emit('candidate', {
          candidate: data.payload,
          socketID: data.socketID.local
        })
      }
    }
  })

})
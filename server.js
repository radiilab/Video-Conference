
const express = require('express')
const ngrok = require('ngrok');
const user = process.env.USER;
const password = process.env.PASSWORD;
require('dotenv').config();

var io = require('socket.io')
({
  path: '/webrtc'
})

const app = express()
const port = process.env.PORT || 8080 ;

// app.get('/', (req, res) => res.send('Hello World!!!!!'))

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
}, (err, url) => {
  if (err) {
      console.error('Error while connecting Ngrok',err);
      return new Error('Ngrok Failed');
  } else {
      console.log('Tunnel Created -> ', url);
      console.log('Tunnel Inspector ->  http://127.0.0.1:4040');
  }
}).then(uri =>{
  console.log(uri);
}).catch(err=>{
  console.error(err);
  console.trace();
});
io.listen(server)

// https://www.tutorialspoint.com/socket.io/socket.io_namespaces.htm
const peers = io.of('/webrtcPeer')

// keep a reference of all socket connections
let connectedPeers = new Map()

peers.on('connection', socket => {

  console.log(socket.id)
  socket.emit('connection-success', { success: socket.id })

  connectedPeers.set(socket.id, socket)

  socket.on('disconnect', () => {
    console.log('disconnected')
    connectedPeers.delete(socket.id)
  })

  socket.on('offerOrAnswer', (data) => {
    // send to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID) {
        console.log(socketID, data.payload.type)
        socket.emit('offerOrAnswer', data.payload)
      }
    }
  })

  socket.on('candidate', (data) => {
    // send candidate to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID) {
        console.log(socketID, data.payload)
        socket.emit('candidate', data.payload)
      }
    }
  })

})
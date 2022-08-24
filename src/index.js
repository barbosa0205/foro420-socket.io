const express = require('express')
const { Server } = require('socket.io')
const http = require('http')

const cors = require('cors')

//configure express
const app = express()

//configure http server
const server = http.createServer(app)

//puerto
const port = process.env.PORT || 3443

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  })
)

app.get('/', (req, res) => {
  res.send('foro-420-socket.io 🥦')
})

//configure socket.io server
const io = new Server(server, {
  cors: {
    origin: `*`,
  },
  transports: ['websocket'],
})

io.on('connection', (socket) => {
  io.to(socket.id).emit('connected', socket.id)
  console.log('socket', socket.id, 'connected')
  socket.emit('verifyAlerts', 'verifyAlerts')

  socket.on('notificationAlert', ({ socketEmisor, socketReceptor, data }) => {
    console.log('notification', data)
    socket.to(socketReceptor).emit('notification', data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`)
})

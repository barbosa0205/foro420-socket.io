import express from 'express'
import { Server as WebSocketServer } from 'socket.io'
import http from 'http'

import cors from 'cors'

//configure express
const app = express()

//configure http server
const server = http.createServer(app)

//puerto
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  })
)

app.get('/', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'foro420-socket.io server',
  })
})

//configure socket.io server
const io = new WebSocketServer(server, {
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

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

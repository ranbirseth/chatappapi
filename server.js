import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = [{}]

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
},))
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log(`user connected with id ${socket.id}`)


  // joining a usser 
  socket.on("enterd", (val) => {
    console.log(val)
    socket.broadcast.emit('join', val)

    users[socket.id] = val
  })

  //user disconnnect
  socket.on("disconnect", () => {
    socket.broadcast.emit('leave', `${socket.id} is lift`)
    console.log(`${socket.id} , is Disconnected `)
  })

  socket.emit("welcome", { user: "admin", massage: "" })

///when sennding a massage

socket.on('massage' , ({massage , id})=>{
io.emit('sendmassage' , {user : users[id] , massage :massage , id  })
})

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
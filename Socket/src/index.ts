const app = require('express')()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
app.use(cors())
const server = http.createServer(app)
const io = new Server(server,{
    cors : {
        origin : "*",
        methods : ["GET","POST"]
    }
})

const PORT = process.env.PORT || 8000

io.on("connection",(socket:any)=>{
    //console.log(`User connected : ${socket.id}`)

    socket.on('send',(data:any)=>{
        //console.log(data)
        socket.emit('receive',data)
    })

    socket.on("disconnect",()=>{
        //console.log(`User disconnected : ${socket.id}`)
    })
})





server.listen(PORT,()=>{
    console.log(`Server listening at ${PORT}`)
})
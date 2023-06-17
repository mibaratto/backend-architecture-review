import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './router/userRouter'
import { playlistRouter } from './router/playlistRouter'

dotenv.config()

const app = express()

//midlewares
app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Server running on port ${Number(process.env.PORT) || 3003}`)
})

//midlewares
app.use("/users", userRouter) //vem antes das definições de endpoints
app.use("/playlists", playlistRouter)

//endpoints
app.get("/ping", (req, res) => {
    res.send("Pong! Backend review 2")
})


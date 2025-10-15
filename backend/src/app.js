import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieParser())

app.use(express.json({limit: '16kb'}))

app.use(express.urlencoded({extended: true, limit: '16kb'}))

app.use(express.static("public"))

//import routers
import { studentRouter} from './routes/student.routes.js'
app.use("/api/v1/student",studentRouter)

import { messRouter } from './routes/mess.routes.js'
app.use("/api/v1/mess",messRouter)

export { app }

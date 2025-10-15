import dotenv from 'dotenv'
dotenv.config({path: '.env'})

import { app } from './app.js'
import connectDB from './db/index.js'

connectDB().
then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
}).
catch((err) => {
    console.log("MongoDB connection failed !!! ", err)
})

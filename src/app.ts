import express from 'express'

const app = express()
app.use(express.json())
import './Database/connection.js'
import userRoute from './routes/userRoute.js';


app.use('/', userRoute)

export default app
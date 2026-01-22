import express from 'express'

const app = express()
app.use(express.json())
import './Database/connection.js'
import userRoute from './routes/userRoute.js';
import categoryRoute from './routes/categoryRoute.js'


app.use('/', userRoute)
app.use("/category", categoryRoute)

export default app
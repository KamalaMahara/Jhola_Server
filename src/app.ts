import express from 'express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

import './Database/connection.js'
import userRoute from './routes/userRoute.js';
import categoryRoute from './routes/categoryRoute.js'
import orderRoute from './routes/orderRoute.js'

import productRoute from './routes/productRoute.js'


app.use('/', userRoute)
app.use("/category", categoryRoute)
app.use("/product", productRoute)
app.use("/order", orderRoute)

export default app
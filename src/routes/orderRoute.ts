import express, { Router } from 'express'
import orderController from '../controller/orderController.js'
import userMiddleware from '../middleware/userMiddleware.js'
import errorHandler from '../services/errorHandler.js'
const router: Router = express.Router()

router.route("/").post(userMiddleware.isUserLoggedIn, errorHandler(orderController.createOrder))
router.route("/verify-pidx").post(userMiddleware.isUserLoggedIn, errorHandler(orderController.verifyTransaction))



export default router
import express, { Router } from 'express'
import orderController from '../controller/orderController.js'
import userMiddleware, { Roles } from '../middleware/userMiddleware.js'
import errorHandler from '../services/errorHandler.js'
import cartController from '../controller/cartController.js'
const router: Router = express.Router()



router.route("/").post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Customer), errorHandler(cartController.addToCart)).get(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Customer), errorHandler(cartController.getMyCartItems))

router.route("/").delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Customer), errorHandler(cartController.deleteMyCartItem))

router.route("/:productId").patch(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Customer), errorHandler(cartController.addToCart))






export default router
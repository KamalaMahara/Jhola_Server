import express, { Router } from 'express'
import productController from '../controller/productController.js'
import userMiddleware, { Roles } from '../middleware/userMiddleware.js'
import { multer, storage } from '../middleware/multerMiddleware.js'

const upload = multer({ storage })
const router: Router = express.Router()
//only loggedin and admin can post the products 
//everyone(admin/user) can get the products

router.route("/").post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Admin), upload.single("productImage"), productController.createProduct)
  .get(productController.getAllProducts)

//post gareko product admin le matra delete garna pauxa ani single product get garna sable payo

router.route("/:id").delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Admin), productController.deleteProduct)
  .get(productController.getSingleProduct)
  .delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Admin), productController.deleteProduct).patch(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Admin), upload.single("productImage"), productController.updateProduct)

export default router
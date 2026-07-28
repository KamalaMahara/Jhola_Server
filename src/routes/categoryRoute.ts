
import userMiddleware, { Roles } from "../middleware/userMiddleware.js"

import express, { Router } from "express"
import CategoryController from "../controller/CategoryController.js"
import { multer, storage } from "../middleware/multerMiddleware.js"
import errorHandler from "../services/errorHandler.js"

const upload = multer({ storage })
const router: Router = express.Router()


router.route("/").get(CategoryController.getCategories)
  .post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Admin), upload.single("categoryImage"), errorHandler(CategoryController.addCategory))

router.route("/:id")
  .patch(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Admin), upload.single("categoryImage"), errorHandler(CategoryController.updateCategories))
  .delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Roles.Admin), errorHandler(CategoryController.deleteCategories))

export default router
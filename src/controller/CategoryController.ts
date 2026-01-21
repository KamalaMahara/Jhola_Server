import Category from "../Database/models/categoryModel.js"
import type { Request, Response } from "express"



class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics"
    },
    {
      categoryName: "Groceries"
    },
    {
      categoryName: "foods"
    }
  ]

  async seedCategory(): Promise<void> {
    const datas = await Category.findAll()

    if (datas.length === 0) {
      await Category.bulkCreate(this.categoryData)
      console.log("Categories seeded successfully")

    }
    else {
      console.log("categories already seeded")
    }

  }
  static categoryData(categoryData: any) {
    throw new Error("Method not implemented.")
  }

  async addCategory(req: Request, res: Response) {
    const { categoryName } = req.body

    if (!categoryName) {
      res.status(400).json({
        message: "please provide categoryName"
      })
      return
    }
    await Category.create({
      categoryName
    })
    res.status(200).json({
      message: "Category created successfully"
    })
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll()
    res.status(200).json({
      message: "fetched categories",
      data
    })
  }
  async deleteCategories(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    if (!id) {
      res.status(400).json({
        message: "please provide id to delete"
      })
      return
    }
    const [data] = await Category.findAll({
      where: {
        id
      }
    }) // this returns data in array
    // const data=await Category.findByPk(id) //returns object

    if (!data) {
      res.status(404).json({
        message: "no category with that id"
      })

    }
    else {
      await Category.destroy({
        where: { id }
      })
      res.status(200).json({
        message: "category deleted successfully"
      })
    }

  }

  async updateCategories(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { categoryName } = req.body
    if (!id || !categoryName) {
      res.status(400).json({
        message: "please provide id ,categoryNameto update "
      })
      return
    }
    const [data] = await Category.findAll({
      where: {
        id
      }
    }) // this returns data in array
    // const data=await Category.findByPk(id) //returns object

    if (!data) {
      res.status(404).json({
        message: "no category with that id"
      })

    }
    else {
      await Category.update({
        categoryName
      }, {
        where: { id }
      })
      res.status(200).json({
        message: "Category updated successfully"
      })
    }
  }

}
export default new CategoryController
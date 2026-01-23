import type { Request, Response } from "express"
import Product from "../Database/models/product.Model.js"
import Category from "../Database/models/categoryModel.js"



class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
    const { productName, productDescription, productPrice, productTotalStock, productDiscount, categoryId } = req.body

    console.log(req.file)

    const fileName = req.file

    if (!productName || !productDescription || !productPrice || !productTotalStock || !productDiscount || !categoryId) {
      res.status(400).json({
        message: "please provide all the product details"
      })
      return
    }
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      productDiscount: productDiscount || 0,
      categoryId,
      productImageUrl: fileName

    })
    res.status(200).json({
      message: "product created succesfully"
    })
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    const datas = await Product.findAll({
      // product table ma vako categoriesId lae product table sanga join garnu paryo .kinaki product table ma vayeko  sabai data aauxa ani categoriesId pani aauxa tessaile join paryo

      include: [
        {
          model: Category,
          attributes: ['id', 'categoryName']
        }
      ]
    })
    res.status(200).json({
      message: "Product fetched successfully",
      data: datas
    })
  }
  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const datas = await Product.findAll({
      //euta single product linu xa so tesko id chahiyo 
      where: {
        id
      },

      include: [
        {
          model: Category,
          attributes: ['id', 'categoryName']

        }
      ]
    })
    res.status(200).json({
      message: "Product fetched successfully",
      data: datas
    })
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const datas = await Product.findAll({
      //jun product delete garne ho tesko id chahiyo
      where: {
        id: id
      }
    })
    //check if there's product of that id
    if (datas.length === 0) {
      res.status(404).json({
        message: "no product with that id"
      })
    }
    else {// product xa vane delete garne
      await Product.destroy({
        where: {
          id
        }
      })

      res.status(200).json({
        message: "Product deleted successfully",
        data: datas
      })
    }

  }

  async updateProduct(req: Request, res: Response): Promise<void> {

    const { productName, productDescription, productPrice, productTotalStock, productDiscount, categoryId } = req.body
    const id = req.params.id as string
    const productDatas = await Product.findByPk(id)

    if (!productDatas) {
      res.status(404).json({
        message: "no product found with that id to update"
      })
      return
    }
    //handle file upload if the product if present

    const fileName = req.file ? req.file.filename : productDatas.productImageUrl;

    //update product fields

    await productDatas.update({
      productName: productName ?? productDatas.productName,

      productDescription: productDescription ?? productDatas.productDescription,

      productPrice: productPrice ?? productDatas.productPrice,

      productTotalStock: productTotalStock ?? productDatas.productTotalStock,

      productDiscount: productDiscount ?? productDatas.productDiscount,

      categoryId: categoryId ?? productDatas.categoryId,

      productImageUrl: fileName
    })
    res.status(200).json({
      message: "Product updated Successfully",
      data: productDatas
    })

  }


}

export default new ProductController
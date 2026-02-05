import type { Request, Response } from 'express'
import { Cart } from '../Database/models/cartModel.js'
import Product from '../Database/models/product.Model.js'


interface AuthRequest extends Request {
  user?: {
    id: string
  }
}



class CartController {
  async addToCart(req: AuthRequest, res: Response) {
    // add to cart garda k k data aauxa: ko user ho kasle cart ma halna khojdai x (userId),kun product (productId),tyo product kati quantity ma.

    const userId = req.user?.id // userid chai usermiddleware ma isuserloggedin method user lae login garda kheri user ko data 'req.user ' ma aayeko hunxa so hamile tei bata user ko id liyam r baki chai body bata liyam ani req ma user property hudaina so extend garera use grya

    const { productId, quantity } = req.body
    if (!productId || !quantity) {
      res.status(400).json({
        message: " please provide productid and quantity"
      })
      return
    }
    //aba cart ko data haru cart table ma rakhne
    //check if that item already exists in that user cart  ,if yes, just qty++ else insert item 


    let userKoCartMaItemAlreadyXa = await Cart.findOne({
      where: {
        productId,
        userId
      }
    })

    //raw query: select* from cart where productId=? AND userid=? 

    if (userKoCartMaItemAlreadyXa) {
      userKoCartMaItemAlreadyXa.quantity += quantity
      await userKoCartMaItemAlreadyXa.save()
    }
    else {

      await Cart.create({
        userId,
        productId
      })
    }
    res.status(200).json({
      message: "Product added to Cart "
    })
  }
  async getMyCartItems(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    //userId ko  k k xa tesko cart ma, tyo  findAll garxa r array return grxa 

    const cartItems = await Cart.findAll({
      where: {
        userId
      },
      //ani tyo cart ma find garda hami lae userid ,createdAt,updateAt,ani productId dinxa.aba hami lae product ko details dekhunu xa so tesko id   forign key ho so  forign key lae join   garnu paryo:
      include: [
        {
          model: Product,
          attributes: ['id', 'productName', 'productPrice', 'productImageUrl'] //product ko sabai details chahiyena limited matra chahiyema yesari grni j j need x
        }
      ]

    })
    if (cartItems.length === 0) {
      res.status(404).json({
        message: "no items in the cart, its empty"
      })
    }
    else {
      res.status(200).json({
        message: "Cart items fetched successfully",
        data: cartItems
      })
    }
  }

  async deleteMyCartItem(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    const { productId } = req.body
    //check if the product exists or not


    const product = await Product.findOne({ where: { userId, productId } }) //findOne,findById,findByPK le object return grxn

    if (!product) {
      res.status(404).json({
        message: "no product with that id"
      })
      return
    }
    await Cart.destroy({
      where: {
        productId,
        userId
      }
    })
    res.status(200).json({
      message: "Product from cart deleted sucessfully"
    })
  }

  async updateCartItemsQuantity(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    const { productId } = req.params
    const { quantity } = req.body

    if (!productId || !quantity) {
      res.status(400).json({
        message: "please provide productId and quantity to update"
      })
      return
    }
    const cartItem = await Cart.findOne({
      where: {
        userId,
        productId
      }
    })
    if (!cartItem) {
      res.status(404).json({
        message: "no cart item with that product id"
      })
      return
    }

    cartItem.quantity = quantity
    await cartItem.save()
    res.status(200).json({
      message: "cart item quantity updated successfully"
    })

  }




}
export default new CartController
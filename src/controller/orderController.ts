//user le product order,cancell and checkout ani payment  garna, paunu paryo so 

import type { Request, Response } from "express"
import Order from "../Database/models/orderModel.js"
import OrderDetail from "../Database/models/orderDetails.js"
import { PaymentMethods } from "../globals/types/index.js"
import Payment from "../Database/models/paymentModel.js"
import axios from 'axios'

interface IProduct {
  productId: string,
  productQty: string   // qty number hunuparxa
}

interface orderRequest extends Request {
  user?: {
    id: string
  }
}

class OrderController {
  async createOrder(req: orderRequest, res: Response): Promise<void> {
    const userId = req.user?.id

    const { phoneNumber, shippingAddress, totalAmount, paymentMethod } = req.body

    const products: IProduct[] = req.body.products

    //IProduct euta array ho so product ko details array ko format ma aauxa like: frontend bata yesari array of object maa aauxa so array ma ! rakhna paudaina tesle always true garxa value .array of object aaya hunale tesko type dinu paryo so interface banako 

    /* IProducts =[
      {
        productName: 99890,  frontend bata data ko name hain id aauxa 
        productQty:2
      },
      { 
        productname:8908,
        productQty:4
      }
    ] */

    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      products.length == 0
    ) {
      res.status(400).json({
        message: "please fil out all the order details :phonenumber,shippingAddress,totoalamount ,products"
      })
      return
    }

    //for order
    const orderDdata = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId
    })

    //for orderDetails
    // euta user le dherai products order garna sakxa so loop use grya
    products.forEach(async function (product) {
      await OrderDetail.create({
        productId: product.productId,
        quantity: product.productQty,
        orderId: orderDdata.id,
        userId
      })
    })

    // for payment 
    const paymentData = await Payment.create({
      orderId: orderDdata.id,
      paymentMethod: paymentMethod

    })

    if (paymentMethod == PaymentMethods.Khalti) {
      //khalti integration  logic
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173",
        amount: totalAmount * 100,
        purchase_order_id: orderDdata.id,
        purchase_order_name: "order_" + orderDdata.id
      }
      const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", data, {
        headers: {
          Authorization: "key d972b59e9e9d497ebdc339680f78861c"
        }
      })
      const khaltiReponse = response.data
      paymentData.pidx = khaltiReponse.pidx
      paymentData.save()
      res.status(200).json({
        message: "order created successfully",
        url: khaltiReponse.payment_url
      })
    }
    else {
      // esewa logic
    }


  }

}



export default new OrderController()

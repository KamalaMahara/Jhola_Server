//user le product order,cancell and checkout ani payment  garna, paunu paryo so 

import type { Request, Response } from "express"
import Order from "../Database/models/orderModel.js"
import OrderDetail from "../Database/models/orderDetails.js"
import { OrderStatus, PaymentMethods, PaymentStatus } from "../globals/types/index.js"
import Payment from "../Database/models/paymentModel.js"
import axios from 'axios'
import Product from "../Database/models/product.Model.js"
import { Cart } from "../Database/models/cartModel.js"
import User from "../Database/models/user.model.js"

interface IProduct {
  productId: string,
  productQty: number   // qty number hunuparxa
}

interface orderRequest extends Request {
  user?: {
    id: string
  }
}
class OrderWithPaymentId extends Order {
  declare paymentId?: string | null
}

class OrderController {
  async createOrder(req: orderRequest, res: Response): Promise<void> {
    const userId = req.user?.id

    const { phoneNumber, firstName, lastName, email, totalAmount, paymentMethod, city, addressLine, state, zipCode } = req.body

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

      !totalAmount ||
      products.length == 0 || !firstName || !lastName || !email || !zipCode || !city || !state || !addressLine
    ) {
      res.status(400).json({
        message: "please fil out all the order details :phonenumber,totoalamount ,products"
      })
      return
    }

    //for order

    let data;
    // for payment 
    const paymentData = await Payment.create({

      paymentMethod: paymentMethod

    })
    const orderDdata = await Order.create({
      phoneNumber,

      totalAmount,
      userId,
      firstName,
      lastName, email,
      city, zipCode, addressLine, state,
      paymentId: paymentData.id

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

      await Cart.destroy({
        where: {
          productId: product.productId,
          userId: userId
        }
      })
    })



    if (paymentMethod == PaymentMethods.Khalti) {
      //khalti integration  logic
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173", //frontend url
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
        url: khaltiReponse.payment_url,
        pidx: khaltiReponse.pidx,
        data
      })
    }
    else if (paymentMethod == PaymentMethods.Esewa) {
      // esewa logic
    }
    else {
      res.status(200).json({
        message: "order created successfully",
        data
      })
    }
  }
  async verifyTransaction(req: orderRequest, res: Response): Promise<void> {
    const { pidx } = req.body
    if (!pidx) {
      res.status(400).json({
        message: "please provide pidx for verification"
      })
      return
    }

    const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/", {
      pidx: pidx
    }, {
      headers: {
        Authorization: "key d972b59e9e9d497ebdc339680f78861c"
      }

    })
    const data = response.data
    if (data.status === "Completed") {
      // 1. Mark payment as Paid
      await Payment.update(
        { paymentstatus: PaymentStatus.Paid },
        { where: { pidx } }
      )

      // 2. Find the order linked to this pidx to get its orderDetails
      const payment = await Payment.findOne({ where: { pidx } })
      if (payment) {
        const order = await Order.findOne({ where: { paymentId: payment.id } })
        if (order) {
          // 3. Fetch all order details for this order
          const orderDetails = await OrderDetail.findAll({ where: { orderId: order.id } })

          // 4. Reduce stock for each product ordered
          for (const detail of orderDetails) {
            const productId = (detail as any).productId
            await Product.decrement(
              { productTotalStock: detail.quantity },
              { where: { id: productId } }
            )
          }
        }
      }

      res.status(200).json({
        message: "Payment verified successfully !!"
      })
    }
    else {
      res.status(200).json({
        message: "payment not verified or cancelled"
      })
    }



  }

  async fetchMyOrders(req: orderRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    const orders = await Order.findAll({
      where: {
        userId
      },
      attributes: ["id", "totalAmount", "orderStatus", "createdAt", "email", "phoneNumber", "firstName", "lastName", "city", "state", "addressline", "zipCode"],
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentstatus"]
        },
        {
          model: OrderDetail,
          attributes: ["quantity", "id"],
          include: [
            {
              model: Product,
              attributes: ["productName", "productPrice", "productImageUrl",]
            }
          ]
        }
      ]
    });

    if (orders.length > 0) {
      res.status(200).json({
        message: "order fetched successfully",
        data: orders
      });
    } else {
      res.status(404).json({
        message: "no order found",
        data: []
      });
    }
  }
  async fetchMyOrderDetail(req: orderRequest, res: Response): Promise<void> {
    const orderId = req.params.id
    const userId = req.user?.id

    const order = await Order.findOne({
      where: {
        id: orderId,
        userId
      },
      attributes: ["id", "totalAmount", "orderStatus", "createdAt", "email", "phoneNumber", "firstName", "lastName", "city", "state", "addressline", "zipCode"],
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentstatus"]
        },
        {
          model: OrderDetail,
          attributes: ["quantity", "id"],
          include: [
            {
              model: Product,
              attributes: ["productName", "productPrice", "productImageUrl"]
            }
          ]
        }
      ]
    })

    if (order) {
      res.status(200).json({
        message: "order fetched successfully",
        data: order
      })
    } else {
      res.status(404).json({
        message: "no order found"
      })
    }
  }

  async cancelMyOrder(req: orderRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const userId = req.user?.id;

    const order = await Order.findAll({
      where: {
        id: orderId,
        userId: userId
      }
    })
    if (order.length === 0) {
      res.status(404).json({
        message: "no order found with that id for cancellation"
      })
    }
    else {
      // check order status if it's already delivered or not
      if (order[0].orderStatus === OrderStatus.Ontheway || order[0].orderStatus === OrderStatus.Preparation) {
        res.status(403).json({
          message: "order can't be cancelled as it's already in preparation or on the way"
        })
        return
      }
      await Order.update(
        { orderStatus: OrderStatus.Cancelled },
        { where: { id: orderId, userId: userId } }
      )
      res.status(200).json({
        message: "order cancelled successfully"
      })
    }
  }
  async changeOrderStatus(req: orderRequest, res: Response): Promise<void> {
    const orderId = req.params.id
    const { orderStatus } = req.body

    if (!orderId || !orderStatus) {
      res.status(400).json({
        message: "please provide order id and order status to update"

      })

    }
    await Order.update({
      orderStatus: orderStatus
    }, {
      where: {
        id: orderId
      }
    })
    res.status(200).json({
      message: "order status updated successfully"
    })
  }
  async deleteOrder(req: orderRequest, res: Response): Promise<void> {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const order: OrderWithPaymentId = await Order.findByPk(orderId) as OrderWithPaymentId
    const paymentId = order?.paymentId

    if (!order) {
      res.status(400).json({
        message: "please provide order id to delete"
      })
      return
    }
    await OrderDetail.destroy({
      where: {
        orderId
      }
    })
    await Payment.destroy({
      where: {
        id: paymentId
      }
    })
    await Order.destroy({
      where: {
        id: orderId
      }
    })
    res.status(200).json({
      message: "order deleted successfully"
    })

  }
  async fetchAllOrders(req: orderRequest, res: Response): Promise<void> {
    const orders = await Order.findAll({
      attributes: ["id", "totalAmount", "orderStatus", "createdAt", "email", "phoneNumber", "firstName", "lastName", "city", "state", "addressline", "zipCode"],
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentstatus"]
        },
        {
          model: OrderDetail,
          attributes: ["quantity", "id"],
          include: [
            {
              model: Product,
              attributes: ["productName", "productPrice", "productImageUrl"]
            }
          ]
        },
        {
          model: User,
          attributes: ["id", "username", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      message: "all orders fetched successfully",
      data: orders
    });
  }
}


export default new OrderController()






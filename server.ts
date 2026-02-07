import "./src/Database/connection.js"
import adminSeeder from './src/adminSeeder.js';
import app from './src/app.js'
import { envConfig } from './src/configuration/config.js'
import CategoryController from "./src/controller/CategoryController.js";
import { Server } from 'socket.io'
import http from 'http'
import jwt from 'jsonwebtoken'
import User from "./src/Database/models/user.model.js";
import { OrderStatus } from "./src/globals/types/index.js";
import Order from "./src/Database/models/orderModel.js";



function startServer() {
  const port = envConfig.port || 4000;

  const server = http.createServer(app);

  server.listen(port, () => {
    CategoryController.seedCategory()
    console.log(`Server is running on port ${port}`);
    adminSeeder()
  })
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"]

    }
  })
  //ko ko user online xa vanera track grne 
  let onlineUsers: { socketId: string, userId: string, role: string }[] = []

  let addToOnlineUsers = (socketId: string, userId: string, role: string) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId)
    onlineUsers.push({ socketId, userId, role })
  }

  io.on("connection", (socket) => {
    const { token } = socket.handshake.auth
    if (token) {
      jwt.verify(token, envConfig.jwtSecretKey as string, async (error: any, result: any) => {
        if (error) {
          socket.emit("error", "invalid token")
        } else {

          const userData = await User.findByPk(result.userid)
          if (!userData) {
            socket.emit("error", "no user with that usesrId")
            return
          }
          //userId grab grne
          addToOnlineUsers(socket.id, result.userId, userData.role)
        }
      });

    }
    else {
      socket.emit("error", "token must be provided")
    }
    socket.on("updateOrderStatus", async (data) => {
      //order status update vayo vane online vako user haru lae notify garne
      const { status, userId, orderId } = data
      const finduser = onlineUsers.find((user) => user.userId === userId)
      await Order.update({
        OrderStatus: status
      },
        {
          where: {
            id: orderId
          }
        })
      if (finduser) {

        io.to(finduser.socketId).emit("success", "order status updated!!")
      }
      else {
        socket.emit("error", "user is not online")
      }

    })
  })

}
startServer();
